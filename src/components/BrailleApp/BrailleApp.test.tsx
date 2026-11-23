import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import BrailleApp from './BrailleApp';

describe('BrailleApp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  test('初期表示・リンク・確定済みエリアを描画する', () => {
    render(<BrailleApp />);

    expect(screen.getByRole('heading', { name: '指点字練習(PC版)' })).toBeDefined();
    expect(screen.getByText('かな入力モード')).toBeDefined();

    const mobileLink = screen.getByRole('link', { name: /スマホ版の指点字練習ページ/ });
    expect(mobileLink.getAttribute('href')).toBe('/practice/mobile');

    const outputArea = screen.getByLabelText('確定済み:') as HTMLTextAreaElement;
    expect(outputArea.value).toBe('');
    expect(screen.getByText('␣')).toBeDefined();
  });

  test('キーボード入力の安定化と解放でプレビュー更新・確定出力・ライブ通知が行われる', () => {
    render(<BrailleApp />);

    // 1. キー押下を反映させる
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));
    });

    // 2. 100ms 経過させて安定化させる
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByText('あ')).toBeDefined();
    expect(screen.getByText('[1]')).toBeDefined();

    // 3. キー解放で確定
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'f' }));
    });

    const outputArea = screen.getByLabelText(
      '確定済み:'
    ) as HTMLTextAreaElement;
    expect(outputArea.value).toBe('あ');
    expect(screen.getByText('␣')).toBeDefined();
  });
});
