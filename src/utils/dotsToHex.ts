import type { BrailleDot } from '../data/types';

/**
 * 指点字の点の番号（1から6の配列）を、対応する16進数の点字コードに変換する。
 * * @param dots 点の番号の配列 (例: [1, 2, 4])
 * @returns 16進数で表された点字コード (例: 0x0B)
 */
export function dotsToHex(dots: BrailleDot[]): number {
  let hexCode = 0;

  // 点の番号と対応するビット値のマッピング
  // 点 1 = 0x01 (1)
  // 点 2 = 0x02 (2)
  // 点 3 = 0x04 (4)
  // 点 4 = 0x08 (8)
  // 点 5 = 0x10 (16)
  // 点 6 = 0x20 (32)

  for (const dot of dots) {
    switch (dot) {
      case 1:
        // ビット論理和代入、以下同様
        hexCode |= 0x01;
        break;
      case 2:
        hexCode |= 0x02;
        break;
      case 3:
        hexCode |= 0x04;
        break;
      case 4:
        hexCode |= 0x08;
        break;
      case 5:
        hexCode |= 0x10;
        break;
      case 6:
        hexCode |= 0x20;
        break;
      default:
        // 1から6以外の無効な番号は無視するか、エラーを発生させます
        // 今回は無視します
        break;
    }
  }

  return hexCode;
}