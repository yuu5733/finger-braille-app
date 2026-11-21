import { describe, expect, test } from 'vitest';
import {
  getBrailleData,
  getNumberData,
  getAlphabetData,
  getCurrentDots,
  isBrailleCodeMatch,
} from './brailleConverter';
import { brailleCodes } from '../data/table';

describe('brailleConverter', () => {
  describe('getBrailleData', () => {
    test('押されたキーからかな・記号の点字データを取得できる', () => {
      const result = getBrailleData(new Set(['f']));
      expect(result?.character).toBe('あ');
      expect(result?.dots).toEqual([1]);
    });

    test('キーの入力順が異なっても同じ組み合わせとして判定される', () => {
      const result = getBrailleData(new Set(['d', 'f']));
      expect(result?.character).toBe('い');
      expect(result?.dots).toEqual([1, 2]);
    });

    test('点字キーの入力がない場合（空のSetや対象外キー）は空白（␣）を返す', () => {
      expect(getBrailleData(new Set())).toEqual({
        character: '␣',
        dots: [],
        brailleChar: '⠀',
      });
      expect(getBrailleData(new Set(['z']))).toEqual({
        character: '␣',
        dots: [],
        brailleChar: '⠀',
      });
    });
  });

  describe('getNumberData', () => {
    test('数字や数字モードの記号を判定できる', () => {
      const one = getNumberData(new Set(['f']));
      expect(one?.character).toBe('1');
      expect(one?.dots).toEqual([1]);

      const dot = getNumberData(new Set(['d']));
      expect(dot?.character).toBe('.');
    });

    test('該当しない組み合わせは null を返す', () => {
      expect(getNumberData(new Set(['k', 'l']))).toBeNull();
    });
  });

  describe('getAlphabetData', () => {
    test('アルファベットや英字モードの記号を判定できる', () => {
      const a = getAlphabetData(new Set(['f']));
      expect(a?.character).toBe('a');

      const k = getAlphabetData(new Set(['f', 's']));
      expect(k?.character).toBe('k');
    });
  });

  describe('getCurrentDots / isBrailleCodeMatch', () => {
    test('点字キー以外を除外し、1〜6の昇順で点の配列を返す', () => {
      expect(getCurrentDots(new Set(['l', 'a', 'f', 'd']))).toEqual([1, 2, 6]);
    });

    test('指定した点字コード（hex）と一致するかを判定できる', () => {
      // 数符 [3, 4, 5, 6] => s, j, k, l (0x3c)
      expect(
        isBrailleCodeMatch(new Set(['l', 'j', 's', 'k']), brailleCodes.suFu)
      ).toBe(true);
      expect(isBrailleCodeMatch(new Set(['f']), brailleCodes.suFu)).toBe(false);
      expect(isBrailleCodeMatch(new Set(), brailleCodes.suFu)).toBe(false);
    });
  });
});
