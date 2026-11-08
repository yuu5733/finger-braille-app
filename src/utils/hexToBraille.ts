import type {BrailleChar} from '../data/types'

/**
 * 16進数の点字コードをUnicode点字文字に変換する
 * @param hexCode 16進数で表された点字コード
 * @returns 対応するUnicode点字文字
 */
export function hexToBraille(hexCode: number): BrailleChar {
  // Unicode点字の基本コード (U+2800) に点字コードを加算して、対応する文字を返す
  return String.fromCodePoint(0x2800 + hexCode) as BrailleChar;
}