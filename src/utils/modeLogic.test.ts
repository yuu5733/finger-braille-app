import { describe, expect, test } from 'vitest';
import { getConvertedCharacter, getModeFromModeChar } from './modeLogic';
import type { ModeChar } from '../data/types';

describe('modeLogic', () => {
  describe('getConvertedCharacter', () => {
    test('Kanaモードでは文字をそのまま返す', () => {
      expect(getConvertedCharacter('Kana', 'あ')).toBe('あ');
    });

    test('character が 不明 の場合はモードに関わらず 不明 を返す', () => {
      expect(getConvertedCharacter('Kana', '不明')).toBe('不明');
      expect(getConvertedCharacter('Dakuon', '不明')).toBe('不明');
      expect(getConvertedCharacter('Question', '不明')).toBe('不明');
    });

    test('濁音・半濁音・拗音系のモードで変換される', () => {
      expect(getConvertedCharacter('Dakuon', 'か')).toBe('が');
      expect(getConvertedCharacter('Handakuon', 'は')).toBe('ぱ');
      expect(getConvertedCharacter('Youon', 'か')).toBe('きゃ');
      expect(getConvertedCharacter('YouDakuon', 'か')).toBe('ぎゃ');
      expect(getConvertedCharacter('YouHandakuon', 'は')).toBe('ぴゃ');
    });

    test('Question / Kuten / Tokushu456 モードの特殊音とフォールバック', () => {
      expect(getConvertedCharacter('Question', 'い')).toBe('うぃ');
      expect(getConvertedCharacter('Question', 'あ')).toBe('？');

      expect(getConvertedCharacter('Kuten', 'か')).toBe('ぐぁ');
      expect(getConvertedCharacter('Kuten', 'あ')).toBe('、');

      expect(getConvertedCharacter('Tokushu456', 'つ')).toBe('でゅ');
      expect(getConvertedCharacter('Tokushu456', 'あ')).toBe('あ');
    });
  });

  describe('getModeFromModeChar', () => {
    test('モード符から対応する InputMode を返す', () => {
      expect(getModeFromModeChar('濁音符')).toBe('Dakuon');
      expect(getModeFromModeChar('半濁音符')).toBe('Handakuon');
      expect(getModeFromModeChar('拗音符')).toBe('Youon');
      expect(getModeFromModeChar('数符')).toBe('Suuji');
      expect(getModeFromModeChar('外字符')).toBe('Alphabet');
      expect(getModeFromModeChar('疑問符')).toBe('Question');
      expect(getModeFromModeChar('句点')).toBe('Kuten');
      expect(getModeFromModeChar('[4,5,6]点')).toBe('Tokushu456');
    });

    test('対応しない文字は null を返す', () => {
      expect(getModeFromModeChar('存在しない符' as ModeChar)).toBeNull();
    });
  });
});
