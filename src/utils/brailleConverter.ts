// 1. コアライブラリ (※ 無し)

// 2. 型定義 (Type Imports)
import type { BrailleData } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { hexToDots } from '../utils/hexToDots';
import { hexToBraille } from '../utils/hexToBraille';

// 5. 相対パスによるインポート (※ 無し)
import { dotsToHex } from './dotsToHex';

// 6. スタイルシート / アセット
import { brailleMappings } from '../data/brailleMappings';
import { numberTable } from '../data/table';

// キーと点字の点の対応マップ
const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

// 点の番号 -> キーボードのキー への逆マッピング
const dotToKeyMap: { [key: number]: string } = {
    1: 'f', 2: 'd', 3: 's',
    4: 'j', 5: 'k', 6: 'l'
};

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * 押されたキーのSetから対応する点字の文字を判定する
 * @param pressedKeys 押されているキーのSet
 * @returns 判定された文字 (見つからない場合はnull)
 */
export function getBrailleData(pressedKeys: Set<string>): BrailleData | null {
  // Setから点の配列に変換し、数字順にソートする
  const currentDots = Array.from(pressedKeys)
    .map(key => keyToDotMap[key])
    .sort((a, b) => a - b);

  const foundMapping = brailleMappings.find(
    (mapping: BrailleData) =>
      mapping.dots && arraysEqual(mapping.dots, currentDots)
  );

  return foundMapping ? foundMapping : null;
}

/**
 * 押されたキーのSetから対応する数字の文字を判定する
 * @param pressedKeys 押されているキーのSet
 * @returns 判定された数字・記号 (見つからない場合はnull)
 */
export function getNumberData(pressedKeys: Set<string>): BrailleData | null {
  // Setから点の配列に変換し、数字順にソートする
  const currentDots = Array.from(pressedKeys)
    .map(key => keyToDotMap[key])
    .sort((a, b) => a - b);

  // 点の配列からHexコードに変換
  const hexCode = dotsToHex(currentDots);
  
  // numberTableから逆引きする（直接参照する）
  const numberMapping = Object.entries(numberTable).find(
    ([character, code]) => code === hexCode
  );

  if (numberMapping) {
    const [character, code] = numberMapping;
    return {
      character: character,
      dots: hexToDots(code), // hexToDotsはインポート済みと仮定
      braille: hexToBraille(code), // hexToBrailleはインポート済みと仮定
    };
  }

  return null;
}

/**
 * 押されたキーのSetから、対応する指点字の点の番号（1-6）の配列を生成する
 * @param pressedKeys 押されているキーのSet
 * @returns ソートされた点の番号の配列
 */
export function getCurrentDots(pressedKeys: Set<string>): number[] {
  return Array.from(pressedKeys)
    .map(key => keyToDotMap[key])
    .filter((dot): dot is number => dot !== undefined) // 点に対応しないキーは除外
    .sort((a, b) => a - b);
}

/**
 * 押されているキーのセットが、指定された点字コード（Hex値）と一致するかを判定する。
 * これにより、数符や外字符などの複雑なコードの判定ロジックが簡素化されます。
 * * @param pressedKeys 現在押されているキーのSet
 * @param targetHex 比較対象の点字コード（Hex値、例: brailleCodes.suuFu）
 * @returns 一致すれば true
 */
export function isBrailleCodeMatch(pressedKeys: Set<string>, targetHex: number): boolean {
    // 1. 押されているキーから現在の点の配列を取得
    const currentDots = getCurrentDots(pressedKeys);
    
    if (currentDots.length === 0) {
        return false;
    }
    
    // 2. 点の配列をHex値に変換 (この関数がソートを担保していることが重要)
    const currentHex = dotsToHex(currentDots);
    
    // 3. 目的のHex値と比較
    return currentHex === targetHex;
}