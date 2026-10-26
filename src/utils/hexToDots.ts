// 1. コアライブラリ (※ 無し)

// 2. 型定義 (Type Imports)
import type { BrailleCode } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート (※ 無し)

// 6. スタイルシート / アセット



// Unicode点字データの16進コードを、押されている点の番号（1から6まで）の配列に変換するユーティリティ関数
export function hexToDots(hexCode: number): BrailleCode {
  const dots: BrailleCode = [];

  if ((hexCode & 0x01) !== 0) dots.push(1);
  if ((hexCode & 0x02) !== 0) dots.push(2);
  if ((hexCode & 0x04) !== 0) dots.push(3);
  if ((hexCode & 0x08) !== 0) dots.push(4);
  if ((hexCode & 0x10) !== 0) dots.push(5);
  if ((hexCode & 0x20) !== 0) dots.push(6);
  return dots;
}