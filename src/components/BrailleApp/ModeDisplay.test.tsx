import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ModeDisplay from './ModeDisplay';
import type { InputMode } from '../../data/types';

describe('ModeDisplay', () => {
  test('各モードに対応するラベルを表示する', () => {
    const { rerender } = render(<ModeDisplay currentMode="Kana" />);
    expect(screen.getByText('かな入力モード')).toBeDefined();

    rerender(<ModeDisplay currentMode="Suuji" />);
    expect(screen.getByText('数字モード')).toBeDefined();

    rerender(<ModeDisplay currentMode="Dakuon" />);
    expect(screen.getByText('濁音 (ﾞ) 待機')).toBeDefined();
  });

  test('未知のモードではフォールバックラベルを表示する', () => {
    render(<ModeDisplay currentMode={'UnknownMode' as unknown as InputMode} />);
    expect(screen.getByText('モード情報なし')).toBeDefined();
  });
});
