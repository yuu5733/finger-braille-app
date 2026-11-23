import { describe, expect, test } from 'vitest';
import { hexToDots } from './hexToDots';
import { dotsToHex } from './dotsToHex';
import type { brailleHex } from '../data/types';

describe('hexToDots', () => {
  test('0x00 は空配列、0x3f は [1, 2, 3, 4, 5, 6] を返す', () => {
    expect(hexToDots(0x00)).toEqual([]);
    expect(hexToDots(0x3f)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('dotsToHex と往復変換できる', () => {
    for (let code = 0x00; code <= 0x3f; code++) {
      const dots = hexToDots(code as brailleHex);
      expect(dotsToHex(dots)).toBe(code);
    }
  });
});
