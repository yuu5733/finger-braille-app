import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import MobileBrailleInput from './MobileBrailleInput';

afterEach(() => {
  cleanup();
});

describe('MobileBrailleInput', () => {
  test('pressedKeys に応じて指ボタンとスペースボタンの aria-pressed が切り替わる', () => {
    render(
      <MobileBrailleInput
        pressedKeys={new Set(['d', 'l'])}
        onKeyPress={vi.fn()}
        onKeyRelease={vi.fn()}
      />
    );

    expect(
      screen
        .getByRole('button', { name: /2.*の点/ })
        .getAttribute('aria-pressed')
    ).toBe('true');
    expect(
      screen
        .getByRole('button', { name: /6.*の点/ })
        .getAttribute('aria-pressed')
    ).toBe('true');
    expect(
      screen
        .getByRole('button', { name: /1.*の点/ })
        .getAttribute('aria-pressed')
    ).toBe('false');
    expect(
      screen
        .getByRole('button', { name: 'スペース' })
        .getAttribute('aria-pressed')
    ).toBe('false');
  });

  test('指ボタンとスペースボタンの操作で対応するキーが onKeyPress / onKeyRelease に渡る', () => {
    const onKeyPress = vi.fn();
    const onKeyRelease = vi.fn();

    render(
      <MobileBrailleInput
        pressedKeys={new Set()}
        onKeyPress={onKeyPress}
        onKeyRelease={onKeyRelease}
      />
    );

    const dot1Button = screen.getByRole('button', { name: /1.*の点/ });
    fireEvent.mouseDown(dot1Button);
    fireEvent.mouseUp(dot1Button);
    expect(onKeyPress).toHaveBeenCalledWith('f');
    expect(onKeyRelease).toHaveBeenCalledWith('f');

    const spaceButton = screen.getByRole('button', { name: 'スペース' });
    fireEvent.touchStart(spaceButton);
    fireEvent.touchEnd(spaceButton);
    expect(onKeyPress).toHaveBeenCalledWith(' ');
    expect(onKeyRelease).toHaveBeenCalledWith(' ');
  });
});
