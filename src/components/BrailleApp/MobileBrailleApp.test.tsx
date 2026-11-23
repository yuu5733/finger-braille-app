import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import MobileBrailleApp from './MobileBrailleApp';

describe('MobileBrailleApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test('スマホ版練習画面の初期表示を描画する', () => {
    render(<MobileBrailleApp />);

    expect(
      screen.getByRole('heading', { name: '指点字練習 (スマホ版)' })
    ).toBeDefined();
    expect(screen.getByText('かな入力モード')).toBeDefined();

    const outputArea = screen.getByLabelText(
      '確定済み:'
    ) as HTMLTextAreaElement;
    expect(outputArea.value).toBe('');
  });

  test('ボタン押下と解放で文字をプレビューし、確定済みエリアに出力する', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1000);

    render(<MobileBrailleApp />);

    const dot1Button = screen.getByRole('button', { name: /1.*の点/ });
    fireEvent.mouseDown(dot1Button);
    expect(screen.getByText('あ')).toBeDefined();

    fireEvent.mouseUp(dot1Button);

    const outputArea = screen.getByLabelText(
      '確定済み:'
    ) as HTMLTextAreaElement;
    expect(outputArea.value).toBe('あ');
  });
});
