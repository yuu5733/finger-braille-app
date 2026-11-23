import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import FingerBrailleSVG from './FingerBrailleSVG';

afterEach(() => {
  cleanup();
});

describe('FingerBrailleSVG', () => {
  test('押下された点のみ塗りつぶし、未押下の点は fill: none になる', () => {
    const { container } = render(
      <FingerBrailleSVG brailleDots={[1, 3]} colorType="hiragana" />
    );

    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(6);

    // 点1: hiragana で #000000
    expect((circles[0] as SVGCircleElement).style.fill).toBe('rgb(0, 0, 0)');
    // 点2: 未押下
    expect((circles[1] as SVGCircleElement).style.fill).toBe('none');
    // 点3: hiragana で #007bff
    expect((circles[2] as SVGCircleElement).style.fill).toBe(
      'rgb(0, 123, 255)'
    );
    // 点4: 未押下
    expect((circles[3] as SVGCircleElement).style.fill).toBe('none');
  });

  test('customColorMap で特定ドットの色を上書きできる', () => {
    const { container } = render(
      <FingerBrailleSVG
        brailleDots={[1]}
        colorType="hiragana"
        customColorMap={{ 1: '#ff0000' }}
      />
    );

    const dot1Circle = container.querySelectorAll(
      'circle'
    )[0] as SVGCircleElement;
    expect(dot1Circle.style.fill).toBe('rgb(255, 0, 0)');
  });
});
