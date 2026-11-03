import { Predictor } from '../../pkg/momors_wasm';
import type { BrailleData } from '../data/types';
import { hexToDots } from './hexToDots';
import { hexToBraille } from './hexToBraille';
import { hiraganaTable, alphabetTable, brailleCodes } from '../data/table';
import { createDakuonData, createYouonData, createSpecialData, dakuonList, handakuonList, youonList, youdakuonList, youhandakuonList, specialPatterns } from '../data/brailleMappings';

// スラッシュや括弧などの記号用マップ
const symbolBrailleMap: Record<string, { hex: number; dots: number[] }> = {
  '/': { hex: 0x0c, dots: [3, 4] },
  '（': { hex: 0x36, dots: [2, 3, 5, 6] },
  '）': { hex: 0x36, dots: [2, 3, 5, 6] },
  '(': { hex: 0x36, dots: [2, 3, 5, 6] },
  ')': { hex: 0x36, dots: [2, 3, 5, 6] },
};

export function parseTextToBrailleCells(
  predictor: Predictor,
  input: string
): { kana: string; brailleCells: BrailleData[] } {
  const predResult = predictor.predict(input);
  try {
    const hiraGana = predResult.kana.replace(/[\u30a1-\u30f6]/g, (match) => 
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    );

    const results: BrailleData[] = [];
    let i = 0;

    while (i < hiraGana.length) {
      const char = hiraGana[i];
      
      // 1. スペースや読点の処理
      if (char === ' ' || char === ' ' || char === '、' || char === '､') {
        results.push({
          character: '␣（間）',
          subCells: [{
            character: ' ',
            braille: '⠀',
            dots: [],
          }]
        });
        i++;
        continue;
      }

      // 2. 連続するアルファベット（英単語）の処理
      if (/[a-zA-Z]/.test(char)) {
        let alphaWord = '';
        let j = i;
        while (j < hiraGana.length && /[a-zA-Z]/.test(hiraGana[j])) {
          alphaWord += hiraGana[j];
          j++;
        }
        
        // 外字符 ＋ 各アルファベットのサブセルを生成
        const subCells = [
          {
            character: '外字符',
            braille: hexToBraille(brailleCodes.gaijiFu),
            dots: hexToDots(brailleCodes.gaijiFu),
          },
          ...alphaWord.split('').map(c => {
            const lower = c.toLowerCase();
            const hex = alphabetTable[lower] ?? 0x00;
            return {
              character: c,
              braille: hexToBraille(hex),
              dots: hexToDots(hex),
            };
          })
        ];

        results.push({
          character: alphaWord,
          subCells,
          columnSpan: subCells.length,
          comment: `英語・外来語: ${alphaWord}`,
        });

        i = j;
        continue;
      }

      // 3. 記号（スラッシュ、括弧など）の処理
      if (symbolBrailleMap[char]) {
        const sym = symbolBrailleMap[char];
        results.push({
          character: char,
          subCells: [{
            character: char,
            braille: hexToBraille(sym.hex),
            dots: sym.dots as any,
          }]
        });
        i++;
        continue;
      }

      // 4. 2文字のパターン（拗音・特殊音）をチェック
      let matched = false;
      if (i + 1 < hiraGana.length) {
        const twoChars = hiraGana.slice(i, i + 2);

        // 4-A. 拗音の判定と処理
        if (
          youonList.includes(twoChars) || 
          youdakuonList.includes(twoChars) || 
          youhandakuonList.includes(twoChars)
        ) {
          results.push(createYouonData(twoChars));
          i += 2;
          matched = true;
          continue;
        }

        // 4-B. 特殊音の判定と処理
        if (specialPatterns.includes(twoChars)) {
          results.push(createSpecialData(twoChars));
          i += 2;
          matched = true;
          continue;
        }

      }

      if (matched) continue;

      // 5. 1文字の濁音・半濁音をチェック
      if (dakuonList.includes(char) || handakuonList.includes(char)) {
        results.push(createDakuonData(char));
        i++;
        continue;
      }

      // 6. 通常の清音・記号などの処理
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