import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import BrailleRow from './BrailleRow';

afterEach(() => {
  cleanup();
});

describe('BrailleRow', () => {
  test('カテゴリ見出しとセル一覧を描画する', () => {
    render(
      <BrailleRow
        category="あ行"
        cells={[
          { character: 'あ', brailleChar: '⠁', dots: [1] },
          { character: 'い', brailleChar: '⠃', dots: [1, 2] },
        ]}
      />
    );

    expect(screen.getByRole('heading', { name: 'あ行' })).toBeDefined();
    expect(screen.getByText('あ')).toBeDefined();
    expect(screen.getByText('い')).toBeDefined();
  });

  test('文字数が5文字以上のセルに longCharacter クラスが適用される', () => {
    const { container } = render(
      <BrailleRow
        category="記号"
        cells={[{ character: '12345', brailleChar: '⠁', dots: [1] }]}
      />
    );

    const charEl = screen.getByText('12345');
    expect(charEl.className).toContain('longCharacter');
    expect(container.querySelectorAll('li')).toHaveLength(1);
  });
});
