import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import FingerButton from './FingerButton';

afterEach(() => {
  cleanup();
});

describe('FingerButton', () => {
  test('点の番号・ショートカットキー・aria-pressed を描画する', () => {
    const { rerender } = render(
      <FingerButton id="leftIndex" isPressed={false} dot={1} shortcutKey="F" />
    );

    const button = screen.getByRole('button', { name: /1.*の点.*F.*キー/ });
    expect(button.getAttribute('aria-pressed')).toBe('false');

    rerender(
      <FingerButton id="leftIndex" isPressed={true} dot={1} shortcutKey="F" />
    );
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  test('マウス操作とタッチ操作で onPress / onRelease が呼ばれる', () => {
    const onPress = vi.fn();
    const onRelease = vi.fn();

    render(
      <FingerButton
        id="leftIndex"
        isPressed={false}
        dot={1}
        onPress={onPress}
        onRelease={onRelease}
      />
    );

    const button = screen.getByRole('button');

    fireEvent.mouseDown(button);
    fireEvent.mouseUp(button);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onRelease).toHaveBeenCalledTimes(1);

    fireEvent.touchStart(button);
    fireEvent.touchEnd(button);
    expect(onPress).toHaveBeenCalledTimes(2);
    expect(onRelease).toHaveBeenCalledTimes(2);
  });
});
