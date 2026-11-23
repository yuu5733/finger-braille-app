import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DynamicBrailleView } from './MomoBrailleList';

afterEach(() => {
  cleanup();
});

describe('DynamicBrailleView', () => {
  test('brailleCells の各セルを描画する', () => {
    const { container } = render(
      <DynamicBrailleView
        brailleCells={[
          { character: 'あ', brailleChar: '⠁', dots: [1] },
          { character: 'い', brailleChar: '⠃', dots: [1, 2] },
        ]}
      />
    );

    expect(screen.getByText('あ')).toBeDefined();
    expect(screen.getByText('い')).toBeDefined();
    expect(screen.getByText('[1]')).toBeDefined();
    expect(screen.getByText('[1, 2]')).toBeDefined();
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });
});
