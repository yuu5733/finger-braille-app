import { describe, expect, test } from 'vitest';
import { hexToBraille } from './hexToBraille';
import type { brailleHex } from '../data/types';

describe('hexToBraille', () => {
  test('代表的な16進コードがUnicode点字文字に変換される', () => {
    expect(hexToBraille(0x00)).toBe('⠀');
    expect(hexToBraille(0x01)).toBe('⠁');
    expect(hexToBraille(0x0b)).toBe('⠋');
    expect(hexToBraille(0x3f)).toBe('⠿');
  });

  test('0x00〜0x3fの全コードがU+2800〜U+283Fの1文字になる', () => {
    for (let code = 0x00; code <= 0x3f; code++) {
      const char = hexToBraille(code as brailleHex);
      expect(char.codePointAt(0)).toBe(0x2800 + code);
    }
  });
});
