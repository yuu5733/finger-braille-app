import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useBrailleLogic } from './useBrailleMainLogic';
import { useBrailleContext } from '../contexts/BrailleContext';
import { useKeyboardListener } from './useKeyboardListener';
import type { BrailleCode, BrailleData, InputMode } from '../data/types';

vi.mock('../contexts/BrailleContext', () => ({
  useBrailleContext: vi.fn(),
}));

vi.mock('./useKeyboardListener', () => ({
  useKeyboardListener: vi.fn(),
}));

describe('useBrailleLogic', () => {
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
    vi.useFakeTimers();
    currentMode = 'Kana';
    pendingData = null;
    character = '';
    dots = [];
    vi.clearAllMocks();
    setupContext();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('100ms 安定後にプレビュー更新し、キー解放で確定出力と表示クリアを行う', () => {
    let pressedKeys = new Set<string>();
    vi.mocked(useKeyboardListener).mockImplementation(() => pressedKeys);

    const { rerender } = renderHook(() => useBrailleLogic());

    pressedKeys = new Set(['f']); // [1] => 'あ'
    rerender();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockOnDisplayUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ character: 'あ', dots: [1] })
    );
    expect(mockSetPendingData).toHaveBeenCalledWith(
      expect.objectContaining({ character: 'あ', dots: [1] })
    );

    pendingData = { character: 'あ', dots: [1], brailleChar: '⠁' };
    character = 'あ';
    dots = [1];
    setupContext();

    pressedKeys = new Set<string>();
    rerender();

    expect(mockOnOutput).toHaveBeenCalledWith('あ');
    expect(mockSetPendingData).toHaveBeenCalledWith(null);
    expect(mockOnDisplayUpdate).toHaveBeenCalledWith({
      character: '',
      brailleChar: '',
      dots: [],
    });
  });

  test('Question 待機中に疑問符 pendingData でスペースを押すと ？ を出力し Kana に戻る', () => {
    currentMode = 'Question';
    pendingData = { character: '疑問符', dots: [2, 6], brailleChar: '⠺' };
    setupContext();

    let pressedKeys = new Set<string>();
    vi.mocked(useKeyboardListener).mockImplementation(() => pressedKeys);

    const { rerender } = renderHook(() => useBrailleLogic());

    pressedKeys = new Set([' ']);
    rerender();

    expect(mockOnOutput).toHaveBeenCalledWith('？');
    expect(mockOnOutput).toHaveBeenCalledWith(' ');
    expect(mockSetCurrentMode).toHaveBeenCalledWith('Kana');
    expect(mockSetPendingData).toHaveBeenCalledWith(null);
  });
});
