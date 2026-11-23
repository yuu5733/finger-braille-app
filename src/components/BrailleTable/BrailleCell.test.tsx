import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import BrailleCell from './BrailleCell';

afterEach(() => {
  cleanup();
});

describe('BrailleCell', () => {
  test('単一セルの文字・点字・点番号・コメント・columnSpan を描画する', () => {
    const { container } = render(
      <BrailleCell
        character="あ"
        brailleChar="⠁"
        dots={[1]}
        columnSpan={2}
        comment="1点"
      />
    );

    expect(screen.getByText('あ')).toBeDefined();
    expect(screen.getByText('⠁')).toBeDefined();
    expect(screen.getByText('[1]')).toBeDefined();
    expect(screen.getByText('1点')).toBeDefined();

    const li = container.querySelector('li');
    expect(li?.getAttribute('data-span')).toBe('2');
  });

  test('subCells 指定時は複数セルの点字・点番号・SVGを描画する', () => {
    const { container } = render(
      <BrailleCell
        character="が"
        colorType="hiragana"
        subCells={[
          { character: '濁音符', brailleChar: '⠐', dots: [5] },
          { character: 'か', brailleChar: '⠁', dots: [1, 6] },
        ]}
      />
    );

    expect(screen.getByText('が')).toBeDefined();
    expect(screen.getByText('⠐')).toBeDefined();
    expect(screen.getByText('⠁')).toBeDefined();
    expect(screen.getByText('[5]')).toBeDefined();
    expect(screen.getByText('[1, 6]')).toBeDefined();

    // 2つの subCell それぞれに SVG が描画される（各SVGに2つの手 = 計4つの svg）
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(4);
  });
});
