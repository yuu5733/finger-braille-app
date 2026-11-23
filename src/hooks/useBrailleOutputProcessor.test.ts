import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useBrailleOutputProcessor } from './useBrailleOutputProcessor';
import type { BrailleData } from '../data/types';

describe('useBrailleOutputProcessor', () => {
  test('pendingData が null のときは何も出力せずリセットもしない', () => {
    const onOutput = vi.fn();
    const setMode = vi.fn();

    const { result } = renderHook(() =>
      useBrailleOutputProcessor(null, 'Kana', onOutput, setMode)
    );

    const res = result.current.processOutput();
    expect(res).toEqual({ shouldResetPendingData: false, nextMode: null });
    expect(onOutput).not.toHaveBeenCalled();
  });

  test('Kana モードで通常文字を出力し、モード符で次モードへ遷移する', () => {
    const onOutput = vi.fn();
    const setMode = vi.fn();
    const aData: BrailleData = { character: 'あ', dots: [1], brailleChar: '⠁' };

    const { result, rerender } = renderHook(
      ({ data, mode }) =>
        useBrailleOutputProcessor(data, mode, onOutput, setMode),
      {
        initialProps: {
          data: aData as BrailleData | null,
          mode: 'Kana' as const,
        },
      }
    );

    expect(result.current.processOutput()).toEqual({
      shouldResetPendingData: true,
      nextMode: null,
    });
    expect(onOutput).toHaveBeenCalledWith('あ');

    const dakuonFuData: BrailleData = {
      character: '濁音符',
      dots: [5],
      brailleChar: '⠐',
    };
    rerender({ data: dakuonFuData, mode: 'Kana' });

    expect(result.current.processOutput()).toEqual({
      shouldResetPendingData: false,
      nextMode: 'Dakuon',
    });
  });

  test('待機モード中に文字が確定すると変換して出力し、Kana へ戻す', () => {
    const onOutput = vi.fn();
    const setMode = vi.fn();
    const kaData: BrailleData = {
      character: 'か',
      dots: [1, 2, 5],
      brailleChar: '⠃',
    };

    const { result } = renderHook(() =>
      useBrailleOutputProcessor(kaData, 'Dakuon', onOutput, setMode)
    );

    expect(result.current.processOutput()).toEqual({
      shouldResetPendingData: true,
      nextMode: 'Kana',
    });
    expect(onOutput).toHaveBeenCalledWith('が');
  });

  test('Suuji モードでは数字を出力して Suuji を維持し、非数字では Kana へ戻す', () => {
    const onOutput = vi.fn();
    const setMode = vi.fn();
    const numData: BrailleData = {
      character: '1',
      dots: [1],
      brailleChar: '⠁',
    };

    const { result, rerender } = renderHook(
      ({ data }) => useBrailleOutputProcessor(data, 'Suuji', onOutput, setMode),
      { initialProps: { data: numData } }
    );

    expect(result.current.processOutput()).toEqual({
      shouldResetPendingData: true,
      nextMode: 'Suuji',
    });
    expect(onOutput).toHaveBeenCalledWith('1');

    const niData: BrailleData = {
      character: 'に',
      dots: [1, 2, 3],
      brailleChar: '⠇',
    };
    rerender({ data: niData });

    expect(result.current.processOutput()).toEqual({
      shouldResetPendingData: true,
      nextMode: 'Kana',
    });
    expect(onOutput).toHaveBeenCalledWith('に');
  });

  test('Alphabet モードでは文字を出力して Alphabet を維持する', () => {
    const onOutput = vi.fn();
    const setMode = vi.fn();
    const aData: BrailleData = { character: 'a', dots: [1], brailleChar: '⠁' };

    const { result } = renderHook(() =>
      useBrailleOutputProcessor(aData, 'Alphabet', onOutput, setMode)
    );

    expect(result.current.processOutput()).toEqual({
      shouldResetPendingData: true,
      nextMode: 'Alphabet',
    });
    expect(onOutput).toHaveBeenCalledWith('a');
  });
});
