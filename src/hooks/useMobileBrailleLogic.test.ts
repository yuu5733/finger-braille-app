import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useMobileBrailleLogic } from './useMobileBrailleLogic';
import { useBrailleContext } from '../contexts/BrailleContext';
import type { BrailleCode, BrailleData, InputMode } from '../data/types';

vi.mock('../contexts/BrailleContext', () => ({
  useBrailleContext: vi.fn(),
}));

describe('useMobileBrailleLogic', () => {
  const mockSetCurrentMode = vi.fn();
  const mockSetPendingData = vi.fn();
  const mockOnOutput = vi.fn();
  const mockOnDisplayUpdate = vi.fn();

  let currentMode: InputMode = 'Kana';
  let pendingData: BrailleData | null = null;
  let character = '';
  let dots: BrailleCode = [];

  function setupContext() {
    vi.mocked(useBrailleContext).mockReturnValue({
      currentMode,
      setCurrentMode: mockSetCurrentMode,
      pendingData,
      setPendingData: mockSetPendingData,
      onOutput: mockOnOutput,
      onDisplayUpdate: mockOnDisplayUpdate,
      character,
      dots,
    } as unknown as ReturnType<typeof useBrailleContext>);
  }

  beforeEach(() => {
    currentMode = 'Kana';
    pendingData = null;
    character = '';
    dots = [];
    vi.clearAllMocks();
    setupContext();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('押下中にキーが追加されても蓄積してプレビューし、全解放で確定する', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1000);

    const { rerender } = renderHook(({ keys }) => useMobileBrailleLogic(keys), {
      initialProps: { keys: new Set(['f']) },
    });

    // 2点目を追加（[1, 2] => 'い'）
    rerender({ keys: new Set(['f', 'd']) });
    expect(mockOnDisplayUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({ character: 'い', dots: [1, 2] })
    );

    pendingData = { character: 'い', dots: [1, 2], brailleChar: '⠃' };
    setupContext();

    // 全指を離す
    rerender({ keys: new Set<string>() });
    expect(mockOnOutput).toHaveBeenCalledWith('い');
    expect(mockSetPendingData).toHaveBeenCalledWith(null);
  });

  test('250ms 以内の連続解放はクールダウンでスキップされる', () => {
    const nowSpy = vi.spyOn(Date, 'now');
    nowSpy.mockReturnValue(1000);

    pendingData = { character: 'あ', dots: [1], brailleChar: '⠁' };
    setupContext();

    const { rerender } = renderHook(({ keys }) => useMobileBrailleLogic(keys), {
      initialProps: { keys: new Set(['f']) },
    });

    // 1回目の解放（確定される）
    rerender({ keys: new Set<string>() });
    expect(mockOnOutput).toHaveBeenCalledTimes(1);

    // 100ms 後に2回目の入力→解放（250ms 未満なのでスキップ）
    nowSpy.mockReturnValue(1100);
    rerender({ keys: new Set(['d']) });
    rerender({ keys: new Set<string>() });
    expect(mockOnOutput).toHaveBeenCalledTimes(1);

    // 250ms 経過後に3回目の入力→解放（確定される）
    nowSpy.mockReturnValue(1250);
    rerender({ keys: new Set(['d']) });
    rerender({ keys: new Set<string>() });
    expect(mockOnOutput).toHaveBeenCalledTimes(2);
  });
});
