import { describe, expect, test, vi } from 'vitest';
import { parseTextToBrailleCells } from './wasmParser';
import type { Predictor } from '../../pkg/momors_wasm';
import { brailleCodes } from '../data/table';

function createMockPredictor(kana: string) {
  const free = vi.fn();
  const predict = vi.fn(() => ({
    kana,
    free,
  }));

  return {
    predictor: { predict } as unknown as Predictor,
    predict,
    free,
  };
}

describe('wasmParser', () => {
  test('カタカナをひらがなに変換し、predResult.free() を呼ぶ', () => {
    const { predictor, predict, free } = createMockPredictor('アイ');

    const res = parseTextToBrailleCells(predictor, '愛');

    expect(predict).toHaveBeenCalledWith('愛');
    expect(res.kana).toBe('あい');
    expect(res.brailleCells).toHaveLength(2);
    expect(res.brailleCells[0].character).toBe('あ');
    expect(res.brailleCells[1].character).toBe('い');
    expect(free).toHaveBeenCalledTimes(1);
  });

  test('スペースや読点が ␣（間） セルになる', () => {
    const { predictor } = createMockPredictor('あ、い う');

    const res = parseTextToBrailleCells(predictor, 'あ、い う');

    expect(res.brailleCells.map((c) => c.character)).toEqual([
      'あ',
      '␣（間）',
      'い',
      '␣（間）',
      'う',
    ]);
  });

  test('連続する英字は外字符付きで1つの塊になる', () => {
    const { predictor } = createMockPredictor('abc');

    const res = parseTextToBrailleCells(predictor, 'abc');

    expect(res.brailleCells).toHaveLength(1);
    expect(res.brailleCells[0].character).toBe('abc');
    expect(res.brailleCells[0].subCells?.[0].character).toBe('外字符');
    expect(res.brailleCells[0].subCells?.[0].dots).toEqual([5, 6]);
    expect(res.brailleCells[0].subCells).toHaveLength(4);
  });

  test('連続する数字は数符付きで1つの塊になる', () => {
    const { predictor } = createMockPredictor('123');

    const res = parseTextToBrailleCells(predictor, '123');

    expect(res.brailleCells).toHaveLength(1);
    expect(res.brailleCells[0].character).toBe('123');
    expect(res.brailleCells[0].subCells?.[0].character).toBe('数符');
    expect(res.brailleCells[0].subCells?.[0].dots).toEqual([3, 4, 5, 6]);
    expect(res.brailleCells[0].subCells).toHaveLength(4);
  });

  test('拗音・特殊音・濁音・記号を適切にセル化する', () => {
    const { predictor } = createMockPredictor('きゃうぃが。');

    const res = parseTextToBrailleCells(predictor, 'きゃうぃが。');

    expect(res.brailleCells.map((c) => c.character)).toEqual([
      'きゃ',
      'うぃ',
      'が',
      '。',
    ]);
    expect(res.brailleCells[0].subCells?.[0].character).toBe('拗音符');
    expect(res.brailleCells[1].subCells?.[0].character).toBe('疑問符');
    expect(res.brailleCells[2].subCells?.[0].character).toBe('濁音符');
    expect(res.brailleCells[3].subCells?.[0].dots).toEqual([2, 5, 6]);
  });

  test('内部処理で例外が発生しても predResult.free() が呼ばれる', () => {
    const free = vi.fn();
    const badPredictor = {
      predict: vi.fn(() => ({
        // replace が無い不正な値を返して例外を起こす
        kana: null as unknown as string,
        free,
      })),
    } as unknown as Predictor;

    expect(() => parseTextToBrailleCells(badPredictor, 'test')).toThrow();
    expect(free).toHaveBeenCalledTimes(1);
  });
});
