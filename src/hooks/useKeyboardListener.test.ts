import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useKeyboardListener } from './useKeyboardListener';

describe('useKeyboardListener', () => {
  test('監視対象の点字キーの押下と解放を反映する', () => {
    const { result } = renderHook(() => useKeyboardListener());

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'J' }));
    });
    expect(result.current).toEqual(new Set(['f', 'j']));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'f' }));
    });
    expect(result.current).toEqual(new Set(['j']));
  });

  test('監視対象外のキーは無視される', () => {
    const { result } = renderHook(() => useKeyboardListener());

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    expect(result.current.size).toBe(0);
  });

  test('スペースキーで preventDefault が呼ばれ、押下状態が管理される', () => {
    const { result } = renderHook(() => useKeyboardListener());

    const downEvent = new KeyboardEvent('keydown', {
      key: ' ',
      cancelable: true,
    });
    const upEvent = new KeyboardEvent('keyup', { key: ' ', cancelable: true });

    act(() => {
      document.dispatchEvent(downEvent);
    });
    expect(downEvent.defaultPrevented).toBe(true);
    expect(result.current.has(' ')).toBe(true);

    act(() => {
      document.dispatchEvent(upEvent);
    });
    expect(upEvent.defaultPrevented).toBe(true);
    expect(result.current.has(' ')).toBe(false);
  });

  test('アンマウント後はイベントリスナーが解除される', () => {
    const { result, unmount } = renderHook(() => useKeyboardListener());

    unmount();

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));
    });
    expect(result.current.size).toBe(0);
  });
});
