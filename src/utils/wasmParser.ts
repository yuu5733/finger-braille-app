import { Predictor } from '../../pkg/momors_wasm';
import type { BrailleData } from '../data/types';
import { hexToDots } from './hexToDots';
import { hexToBraille } from './hexToBraille';
import { hiraganaTable, alphabetTable, numberTable } from '../data/table';
import { createDakuonData, createYouonData, createSpecialData, dakuonList, handakuonList, specialPatterns } from '../data/brailleMappings';

export function parseTextToBrailleCells(
  predictor: Predictor,
  input: string
): { kana: string; brailleCells: BrailleData[] } {
  const predResult = predictor.predict(input);
  try {
    // WASMの予測結果（カタカナ）をひらがなに変換
    const hiraGana = predResult.kana.replace(/[\u30a1-\u30f6]/g, (match) => 
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    );

    const results: BrailleData[] = [];
    let i = 0;

    while (i < hiraGana.length) {
      const char = hiraGana[i];
      
      // スペースや読点の処理（指点字では「、」を空白に置換）
      if (char === ' ' || char === ' ' || char === '、' || char === '､') {
        results.push({
          character: ' ',
          subCells: [{
            character: ' ',
            braille: '⠀',
            dots: [],
          }]
        });
        i++;
        continue;
      }

      // 2文字のパターン（拗音・特殊音）をチェック
      let matched = false;
      if (i + 1 < hiraGana.length) {
        const twoChars = hiraGana.slice(i, i + 2);
        if (specialPatterns.includes(twoChars)) {
          if (twoChars.match(/^[ぎじぢびぴ]ゃ|[ぎじぢびぴ]ゅ|[ぎじぢびぴ]ょ|[きしちでにひみりぎじぢびぴ]ゃ|[きしちでにひみりぎじぢびぴ]ゅ|[きしちでにひみりぎじぢびぴ]ょ/)) {
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

      // 1文字の濁音・半濁音をチェック
      if (dakuonList.includes(char) || handakuonList.includes(char)) {
        results.push(createDakuonData(char));
        i++;
        continue;
      }

      // 通常の清音・記号などの処理
      const hexCode = hiraganaTable[char];
      if (hexCode !== undefined) {
        results.push({
          character: char,
          subCells: [{
            character: char,
            braille: hexToBraille(hexCode),
            dots: hexToDots(hexCode),
          }]
        });
      } else {
        results.push({
          character: char,
          subCells: [{
            character: char,
            braille: '',
            dots: [],
          }]
        });
      }
      i++;
    }

    return {
      kana: hiraGana,
      brailleCells: results,
    };
  } finally {
    predResult.free();
  }
}