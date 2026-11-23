import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useBrailleInputData } from './useBrailleInputData';

describe('useBrailleInputData', () => {
  test('stabilizedKeys が null や点字キーを含まない場合は null を返す', () => {
    const { result: nullRes } = renderHook(() =>
      useBrailleInputData(null, 'Kana')
    );
    expect(nullRes.current).toBeNull();

    const { result: spaceOnlyRes } = renderHook(() =>
      useBrailleInputData(new Set([' ']), 'Kana')
    );
    expect(spaceOnlyRes.current).toBeNull();
  });

  test('Kana モードでは基本のかなデータを返し、待機モードでは変換後の文字になる', () => {
    // 'f' => [1] => 'あ'
    const { result: kanaRes } = renderHook(() =>
      useBrailleInputData(new Set(['f']), 'Kana')
    );
    expect(kanaRes.current?.data.character).toBe('あ');

    // Dakuon 待機中に 'f'（あ）=> 'あ'（濁音マップにないためそのまま）
    // Dakuon 待機中に 'f', 'l'（か = [1, 6] => 0x21）=> 'が'
    const { result: dakuonKaRes } = renderHook(() =>
      useBrailleInputData(new Set(['f', 'l']), 'Dakuon')
    );
    expect(dakuonKaRes.current?.data.character).toBe('が');
  });

  test('Suuji モードでは数字を優先し、非数字はかなフォールバックする', () => {
    // 'f' => [1] => Suuji モードでは '1'
    const { result: numRes } = renderHook(() =>
      useBrailleInputData(new Set(['f']), 'Suuji')
    );
    expect(numRes.current?.data.character).toBe('1');

    // 'f', 'd', 's' => [1, 2, 3] => 0x07（numberTable にないので 'に' にフォールバック）
    const { result: fallbackRes } = renderHook(() =>
      useBrailleInputData(new Set(['f', 'd', 's']), 'Suuji')
    );
    expect(fallbackRes.current?.data.character).toBe('に');
  });

  test('Alphabet / GaijiQuote モードでは外字符やアルファベットを判定する', () => {
    // 外字符 [5, 6] => k, l
    const { result: gaijiRes } = renderHook(() =>
      useBrailleInputData(new Set(['k', 'l']), 'Alphabet')
    );
    expect(gaijiRes.current?.data.character).toBe('外字符');

    // 'f' => [1] => 'a'
    const { result: alphaRes } = renderHook(() =>
      useBrailleInputData(new Set(['f']), 'GaijiQuote')
    );
    expect(alphaRes.current?.data.character).toBe('a');
  });

  test('未定義の点の組み合わせでは character が 不明 になる', () => {
    // [4, 5, 6] => j, k, l => 0x38（各テーブルに未定義）
    const { result } = renderHook(() =>
      useBrailleInputData(new Set(['j', 'k', 'l']), 'Kana')
    );
    expect(result.current?.data.character).toBe('不明');
    expect(result.current?.data.dots).toEqual([4, 5, 6]);
  });
});
