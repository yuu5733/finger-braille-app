import type { BrailleDot } from '../data/types';

// Unicode点字データの16進コードを、押されている点の番号（1から6まで）の配列に変換するユーティリティ関数
export function hexToDots(hexCode: number): BrailleDot[] {
  const dots: BrailleDot[] = [];

  if ((hexCode & 0x01) !== 0) dots.push(1);
  if ((hexCode & 0x02) !== 0) dots.push(2);
  if ((hexCode & 0x04) !== 0) dots.push(3);
  if ((hexCode & 0x08) !== 0) dots.push(4);
  if ((hexCode & 0x10) !== 0) dots.push(5);
  if ((hexCode & 0x20) !== 0) dots.push(6);
  return dots;
}