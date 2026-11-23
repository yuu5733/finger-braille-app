import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ResultDisplay from './ResultDisplay';

describe('ResultDisplay', () => {
  test('空入力時は ␣・⠀・[空白]・0x00 を表示する', () => {
    render(<ResultDisplay text="" brailleChar="" dots={[]} />);

    expect(screen.getByText('␣')).toBeDefined();
    expect(screen.getByText('⠀')).toBeDefined();
    expect(screen.getByText('[空白]')).toBeDefined();
    expect(screen.getByText('0x00')).toBeDefined();
  });

  test('入力データに応じた文字・点字・点配列・16進数を表示する', () => {
    render(<ResultDisplay text="あ" brailleChar="⠁" dots={[1]} />);

    expect(screen.getByText('あ')).toBeDefined();
    expect(screen.getByText('⠁')).toBeDefined();
    expect(screen.getByText('[1]')).toBeDefined();
    expect(screen.getByText('0x01')).toBeDefined();
  });
});
