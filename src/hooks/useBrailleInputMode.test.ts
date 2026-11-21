import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useBrailleInputMode } from './useBrailleInputMode';
import { brailleCodes } from '../data/table';

describe('useBrailleInputMode', () => {
  test('stabilizedKeys が null や空のときは null を返す', () => {
    const { result: nullResult } = renderHook(() => useBrailleInputMode(null));
    expect(nullResult.current).toBeNull();

    const { result: emptyResult } = renderHook(() =>
      useBrailleInputMode(new Set())
    );
    expect(emptyResult.current).toBeNull();
  });

  test('数符・外字符・外字引用符を検知する', () => {
    // 数符 [3, 4, 5, 6] => s, j, k, l
    const { result: suFu } = renderHook(() =>
      useBrailleInputMode(new Set(['s', 'j', 'k', 'l']))
    );
    expect(suFu.current).toEqual({
      mode: 'Suuji',
      char: '数符',
      hexCode: brailleCodes.suFu,
    });

    // 外字符 [5, 6] => k, l
    const { result: gaijiFu } = renderHook(() =>
      useBrailleInputMode(new Set(['k', 'l']))
    );
    expect(gaijiFu.current).toEqual({
      mode: 'Alphabet',
      char: '外字符',
      hexCode: brailleCodes.gaijiFu,
    });

    // 外字引用符（開始）[2, 3, 6] => d, s, l
    const { result: gaijiQuote } = renderHook(() =>
      useBrailleInputMode(new Set(['d', 's', 'l']))
    );
    expect(gaijiQuote.current).toEqual({
      mode: 'GaijiQuote',
      char: '外字引用符',
      hexCode: brailleCodes.gaijiinyoFu_kaishi,
    });
  });

  test('濁音・半濁音・拗音系および特殊音[2,6]/[2,5,6]/[4,5,6]のモード符を検知する', () => {
    // 濁音符 [5] => k
    const { result: dakuon } = renderHook(() =>
      useBrailleInputMode(new Set(['k']))
    );
    expect(dakuon.current).toEqual({
      mode: 'Dakuon',
      char: '濁音符',
      hexCode: brailleCodes.dakuonFu,
    });

    // 半濁音符 [6] => l
    const { result: handakuon } = renderHook(() =>
      useBrailleInputMode(new Set(['l']))
    );
    expect(handakuon.current).toEqual({
      mode: 'Handakuon',
      char: '半濁音符',
      hexCode: brailleCodes.handakuonFu,
    });

    // 拗音符 [4] => j
    const { result: youon } = renderHook(() =>
      useBrailleInputMode(new Set(['j']))
    );
    expect(youon.current).toEqual({
      mode: 'Youon',
      char: '拗音符',
      hexCode: brailleCodes.youonFu,
    });

    // 疑問符 [2, 6] => d, l (0x22)
    const { result: question } = renderHook(() =>
      useBrailleInputMode(new Set(['d', 'l']))
    );
    expect(question.current).toEqual({
      mode: 'Question',
      char: '疑問符',
      hexCode: 0x22,
    });

    // 句点 [2, 5, 6] => d, k, l (0x32)
    const { result: kuten } = renderHook(() =>
      useBrailleInputMode(new Set(['d', 'k', 'l']))
    );
    expect(kuten.current).toEqual({
      mode: 'Kuten',
      char: '句点',
      hexCode: 0x32,
    });

    // [4, 5, 6]点 => j, k, l (0x38)
    const { result: tokushu456 } = renderHook(() =>
      useBrailleInputMode(new Set(['j', 'k', 'l']))
    );
    expect(tokushu456.current).toEqual({
      mode: 'Tokushu456',
      char: '[4,5,6]点',
      hexCode: 0x38,
    });
  });

  test('モード符以外の入力（例: 「あ」= f）では null を返す', () => {
    const { result } = renderHook(() => useBrailleInputMode(new Set(['f'])));
    expect(result.current).toBeNull();
  });
});
