import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useBrailleInputTiming } from './useBrailleInputTiming';

describe('useBrailleInputTiming', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('初期状態では stabilizedKeys が null で isKeysReleased が true', () => {
    const { result } = renderHook(({ keys }) => useBrailleInputTiming(keys), {
      initialProps: { keys: new Set<string>() },
    });

    expect(result.current.stabilizedKeys).toBeNull();
    expect(result.current.isKeysReleased).toBe(true);
  });

  test('100ms 経過で stabilizedKeys が確定する', () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useBrailleInputTiming(keys),
      {
        initialProps: { keys: new Set<string>() },
      }
    );

    rerender({ keys: new Set(['f']) });
    expect(result.current.isKeysReleased).toBe(false);

    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(result.current.stabilizedKeys).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.stabilizedKeys).toEqual(new Set(['f']));
  });

  test('100ms 内にキーが変化するとタイマーがリセットされる', () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useBrailleInputTiming(keys),
      {
        initialProps: { keys: new Set(['f']) },
      }
    );

    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ keys: new Set(['f', 'j']) });

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.stabilizedKeys).toBeNull();

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.stabilizedKeys).toEqual(new Set(['f', 'j']));
  });

  test('キーがすべて離されると stabilizedKeys が null にリセットされる', () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useBrailleInputTiming(keys),
      {
        initialProps: { keys: new Set(['f']) },
      }
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.stabilizedKeys).toEqual(new Set(['f']));

    rerender({ keys: new Set<string>() });
    expect(result.current.stabilizedKeys).toBeNull();
    expect(result.current.isKeysReleased).toBe(true);
  });
});
