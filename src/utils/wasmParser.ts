import { Predictor } from '../../pkg/momors_wasm';

import type { BrailleData, SubCellData, BrailleCode } from '../data/types';

import { hexToDots } from './hexToDots';
import { hexToBraille } from './hexToBraille';
import { hiraganaTable, alphabetTable, brailleCodes } from '../data/table';
import { createDakuonData, createYouonData, createSpecialData, dakuonList, handakuonList, youonList, youdakuonList, youhandakuonList, specialPatterns } from '../data/brailleMappings';

// スラッシュや括弧などの記号用マップ
const symbolBrailleMap: Record<string, { hex: number; dots: BrailleCode }> = {
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
    const kanaEiSuu = predResult.kana.replace(/[\u30a1-\u30f6]/g, (match) => 
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    );

    const results: BrailleData[] = [];
    let i = 0;

    while (i < kanaEiSuu.length) {
      const char = kanaEiSuu[i];
      
      // 1. スペースや読点の処理
      if (char === ' ' || char === ' ' || char === '、' || char === '､') {
        results.push({
          character: '␣（間）',
          subCells: [{
            character: ' ',
            brailleChar: '⠀',
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
        while (j < kanaEiSuu.length && /[a-zA-Z]/.test(kanaEiSuu[j])) {
          alphaWord += kanaEiSuu[j];
          j++;
        }
        
        // 外字符 ＋ 各アルファベットのサブセルを生成
        const subCells: SubCellData[] = [
          {
            character: '外字符',
            brailleChar: hexToBraille(brailleCodes.gaijiFu),
            dots: hexToDots(brailleCodes.gaijiFu),
            colorType: "kigou",
          },
          ...alphaWord.split('').map(c => {
            const lower = c.toLowerCase();
            const hex = alphabetTable[lower] ?? 0x00;
            return {
              character: c,
              brailleChar: hexToBraille(hex),
              dots: hexToDots(hex),
              colorType: "alphabet",
            }satisfies SubCellData;
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

      // 2.5. 連続する数字の処理
      if (/[0-9]/.test(char)) {
        let numWord = '';
        let j = i;
        while (j < kanaEiSuu.length && /[0-9]/.test(kanaEiSuu[j])) {
          numWord += kanaEiSuu[j];
          j++;
        }
        
        // 数符 ＋ 各数字のサブセルを生成（点字の数字1〜9,0は a〜j に対応）
        const subCells: SubCellData[] = [
          {
            character: '数符',
            brailleChar: hexToBraille(brailleCodes.suujiFu ?? 0x3c),
            dots: hexToDots(brailleCodes.suujiFu ?? 0x3c),
            colorType: "number",
          },
          ...numWord.split('').map(c => {
            const mapChar = c === '0' ? 'j' : String.fromCharCode(96 + parseInt(c, 10));
            const hex = alphabetTable[mapChar] ?? 0x00;
            return {
              character: c,
              brailleChar: hexToBraille(hex),
              dots: hexToDots(hex),
              colorType: "number",
            } satisfies SubCellData;
          })
        ];

        results.push({
          character: numWord,
          subCells,
          columnSpan: subCells.length,
          comment: `数字: ${numWord}`,
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
            brailleChar: hexToBraille(sym.hex),
            dots: sym.dots as any,
          }]
        });
        i++;
        continue;
      }

      // 4. 2文字のパターン（拗音・特殊音）をチェック
      let matched = false;
      if (i + 1 < kanaEiSuu.length) {
        const twoChars = kanaEiSuu.slice(i, i + 2);

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
            brailleChar: hexToBraille(hexCode),
            dots: hexToDots(hexCode),
          }]
        });
      } else {
        results.push({
          character: char,
          subCells: [{
            character: char,
            brailleChar: '',
            dots: [],
          }]
        });
      }
      i++;
    }

    return {
      kana: kanaEiSuu,
      brailleCells: results,
    };
  } finally {
    predResult.free();
  }
}