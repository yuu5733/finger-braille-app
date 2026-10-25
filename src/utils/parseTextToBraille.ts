import type { BrailleData } from '../data/types';
import { 
  hiraganaTable 
} from '../data/table';
import { 
  createDakuonData, 
  createYouonData, 
  createSpecialData, 
} from '../data/brailleMappings.ts';
import { hexToDots } from '../utils/hexToDots';
import { hexToBraille } from '../utils/hexToBraille';

// 特殊音・拗音・濁音などの判定リスト（長いパターンを優先してマッチさせるため降順ソート）
const specialPatterns = [
  // 3文字または特殊な組み合わせがあればここに
  'うぃ', 'うぇ', 'うぉ', 'くぁ', 'くぃ', 'くぇ', 'くぉ',
  'ぐぁ', 'ぐぃ', 'ぐぇ', 'ぐぉ', 'つぁ', 'つぃ', 'つぇ', 'つぉ',
  'ふぁ', 'ふぃ', 'ふぇ', 'ふぉ', 'ゔぁ', 'ゔぃ', 'ゔぇ', 'ゔぉ',
  'てゅ', 'ふゅ', 'ふょ', 'でゅ', 'ぶゅ', 'ぶょ', 'すぃ', 'てぃ', 'ずぃ', 'でぃ', 'とぅ', 'どぅ',
  // 拗音
  'きゃ', 'きゅ', 'きょ', 'しゃ', 'しゅ', 'しょ', 'ちゃ', 'ちゅ', 'ちょ',
  'にゃ', 'にゅ', 'にょ', 'ひゃ', 'ひゅ', 'ひょ', 'みゃ', 'みゅ', 'みょ',
  'りゃ', 'りゅ', 'りょ', 'ぎゃ', 'ぎゅ', 'ぎょ', 'じゃ', 'じゅ', 'じょ',
  'ぢゃ', 'ぢゅ', 'ぢょ', 'びゃ', 'びゅ', 'びょ', 'ぴゃ', 'ぴゅ', 'ぴょ',
  'いぇ', 'きぇ', 'しぇ', 'じぇ', 'ちぇ', 'にぇ', 'ひぇ',
];

const dakuonList = ['が', 'ぎ', 'ぐ', 'げ', 'ご', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'だ', 'ぢ', 'づ', 'で', 'ど', 'ば', 'び', 'ぶ', 'べ', 'ぼ'];
const handakuonList = ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'];

/**
 * ひらがな文字列を解析し、指点字表で使える BrailleData の配列に変換する
 */
export function parseHiraganaToBrailleCells(text: string): BrailleData[] {
  const results: BrailleData[] = [];
  let i = 0;

  // カタカナが混ざっている場合はひらがなに変換するか、そのまま許容できるようにする
  const normalizedText = text.replace(/[\u30a1-\u30f6]/g, (match) => 
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );

  while (i < normalizedText.length) {
    // 1. スペースや空白の処理
    const char = normalizedText[i];
    if (char === ' ' || char === ' ') {
      results.push({
        character: '␣（間を取る）',
        braille: '⠀',
        dots: [],
      });
      i++;
      continue;
    }

    // 2. 2文字のパターン（拗音・特殊音）をチェック
    let matched = false;
    if (i + 1 < normalizedText.length) {
      const twoChars = normalizedText.slice(i, i + 2);
      if (specialPatterns.includes(twoChars)) {
        if (twoChars.match(/^[ぎじぢびぴ]ゃ|^[ぎじぢびぴ]ゅ|^[ぎじぢびぴ]ょ|^[きしちでにひみりぎじぢびぴ]ゃ|^[きしちでにひみりぎじぢびぴ]ゅ|^[きしちでにひみりぎじぢびぴ]ょ/)) {
          results.push(createYouonData(twoChars));
        } else {
          results.push(createSpecialData(twoChars));
        }
        i += 2;
        matched = true;
        continue;
      }
    }

    if (matched) continue;

    // 3. 1文字の濁音・半濁音をチェック
    if (dakuonList.includes(char) || handakuonList.includes(char)) {
      results.push(createDakuonData(char));
      i++;
      continue;
    }

    // 4. 通常の清音・記号などの処理
    const hexCode = hiraganaTable[char];
    if (hexCode !== undefined) {
      results.push({
        character: char,
        braille: hexToBraille(hexCode),
        dots: hexToDots(hexCode),
      });
    } else {
      // 未知の文字のフォールバック
      results.push({
        character: char,
        braille: '',
        dots: [],
      });
    }
    i++;
  }

  return results;
}