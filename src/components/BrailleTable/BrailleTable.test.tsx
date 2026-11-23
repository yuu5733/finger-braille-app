import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import BrailleTable from './BrailleTable';

afterEach(() => {
  cleanup();
});

describe('BrailleTable', () => {
  test('見出し・ID・説明文・行データを描画する', () => {
    const { container } = render(
      <BrailleTable
        id="kana-table"
        h2_text="ひらがな"
        description="基本の清音一覧です"
        tableData={[
          {
            category: 'あ行',
            cells: [{ character: 'あ', brailleChar: '⠁', dots: [1] }],
          },
          {
            category: 'か行',
            cells: [{ character: 'か', brailleChar: '⠡', dots: [1, 6] }],
          },
        ]}
      />
    );

    expect(container.querySelector('#kana-table')).not.toBeNull();
    expect(
      screen.getByRole('heading', { name: 'ひらがな｜指点字表' })
    ).toBeDefined();
    expect(screen.getByText('基本の清音一覧です')).toBeDefined();
    expect(screen.getByRole('heading', { name: 'あ行' })).toBeDefined();
    expect(screen.getByRole('heading', { name: 'か行' })).toBeDefined();
    expect(screen.getByText('あ')).toBeDefined();
    expect(screen.getByText('か')).toBeDefined();
  });

  test('description 未指定時は説明文を描画しない', () => {
    render(<BrailleTable id="no-desc-table" h2_text="数字" tableData={[]} />);

    expect(
      screen.getByRole('heading', { name: '数字｜指点字表' })
    ).toBeDefined();
    expect(screen.queryByText('基本の清音一覧です')).toBeNull();
  });
});
