import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import BrailleInput from './BrailleInput';

afterEach(() => {
  cleanup();
});

describe('BrailleInput', () => {
  test('6つの指ボタンとスペースボタンを描画し、pressedKeys に応じて aria-pressed が変わる', () => {
    render(<BrailleInput pressedKeys={new Set(['f', 'j', ' '])} />);

    expect(
      screen
        .getByRole('button', { name: /1.*の点.*F.*キー/ })
        .getAttribute('aria-pressed')
    ).toBe('true');
    expect(
      screen
        .getByRole('button', { name: /2.*の点.*D.*キー/ })
        .getAttribute('aria-pressed')
    ).toBe('false');
    expect(
      screen
        .getByRole('button', { name: /3.*の点.*S.*キー/ })
        .getAttribute('aria-pressed')
    ).toBe('false');
    expect(
      screen
        .getByRole('button', { name: /4.*の点.*J.*キー/ })
        .getAttribute('aria-pressed')
    ).toBe('true');
    expect(
      screen
        .getByRole('button', { name: /5.*の点.*K.*キー/ })
        .getAttribute('aria-pressed')
    ).toBe('false');
    expect(
      screen
        .getByRole('button', { name: /6.*の点.*L.*キー/ })
        .getAttribute('aria-pressed')
    ).toBe('false');
    expect(
      screen
        .getByRole('button', { name: 'スペース' })
        .getAttribute('aria-pressed')
    ).toBe('true');
  });
});
