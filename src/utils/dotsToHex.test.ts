import { describe, expect, test } from 'vitest';
import { dotsToHex } from './dotsToHex';
import type { BrailleDot } from '../data/types';

describe('dotsToHex', () => {
  test('空配列は 0x00 を返す', () => {
    expect(dotsToHex([])).toBe(0x00);
  });

  test('1〜6の各点が対応するビットに変換される', () => {
    expect(dotsToHex([1])).toBe(0x01);
    expect(dotsToHex([2])).toBe(0x02);
    expect(dotsToHex([3])).toBe(0x04);
    expect(dotsToHex([4])).toBe(0x08);
    expect(dotsToHex([5])).toBe(0x10);
    expect(dotsToHex([6])).toBe(0x20);
  });

  test('複数点の組み合わせと全点（1〜6）を変換できる', () => {
    expect(dotsToHex([1, 2, 4])).toBe(0x0b);
    expect(dotsToHex([1, 2, 3, 4, 5, 6])).toBe(0x3f);
  });

  test('重複や1〜6以外の値は適切に処理される', () => {
    expect(dotsToHex([2, 1, 2])).toBe(0x03);
    expect(dotsToHex([0, 1, 7, -1] as unknown as BrailleDot[])).toBe(0x01);
  });
});
