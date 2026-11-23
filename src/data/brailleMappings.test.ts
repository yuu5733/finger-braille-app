import { describe, expect, test } from 'vitest';
import {
  hiraganaAndKigouMappings,
  brailleToCharacterMap,
  seionMappings,
  dakuonList,
  createDakuonData,
  createYouonData,
  createSpecialData,
  numberMappings,
  alphabetMappings,
  generateRyakugoComment,
  createRyakugoData,
  ryakugoMappings,
} from './brailleMappings';

describe('brailleMappings', () => {
  test('hiraganaAndKigouMappings に ゑ は含まれず、逆引きマップが作られる', () => {
    expect(
      hiraganaAndKigouMappings.some((item) => item.character === 'ゑ')
    ).toBe(false);
    expect(seionMappings.some((item) => item.character === 'ゑ')).toBe(true);
    expect(brailleToCharacterMap['⠁']).toBe('あ');
  });

  test('濁音・半濁音データが符号と清音ベースの2セル構成になる', () => {
    expect(dakuonList).not.toContain('ゔ');

    const ga = createDakuonData('が');
    expect(ga.character).toBe('が');
    expect(ga.columnSpan).toBe(2);
    expect(ga.subCells?.map((c) => c.character)).toEqual(['濁音符', 'か']);
    expect(ga.comment).toBe('「濁音符 ＋ か」');

    const pa = createDakuonData('ぱ');
    expect(pa.subCells?.map((c) => c.character)).toEqual(['半濁音符', 'は']);
  });

  test('拗音・拗濁音・拗半濁音データが正しく生成される', () => {
    const kya = createYouonData('きゃ');
    expect(kya.subCells?.map((c) => c.character)).toEqual(['拗音符', 'か']);

    const gya = createYouonData('ぎゃ');
    expect(gya.subCells?.map((c) => c.character)).toEqual(['拗濁音符', 'か']);

    const pya = createYouonData('ぴゃ');
    expect(pya.subCells?.map((c) => c.character)).toEqual(['拗半濁音符', 'は']);
  });

  test('特殊音データが設定通りに生成され、未定義文字はフォールバックする', () => {
    const wi = createSpecialData('うぃ');
    expect(wi.subCells?.map((c) => c.character)).toEqual(['疑問符', 'い']);

    const dyu = createSpecialData('でゅ');
    expect(dyu.subCells?.map((c) => c.character)).toEqual(['[4,5,6点]', 'つ']);

    const unknown = createSpecialData('あ');
    expect(unknown.character).toBe('あ');
    expect(unknown.brailleChar).toBe('⠁');
    expect(unknown.dots).toEqual([1]);
  });

  test('数字・英字・略語マッピングとコメント生成が機能する', () => {
    // Object.entries で列挙するときは負ではない整数インデックス（'0', '1', ...）が昇順で先頭に来る仕様のため
    const suFuMapping = numberMappings.find(
      (item) => item.character === '数符'
    );
    expect(suFuMapping).toBeDefined();
    expect(suFuMapping?.dots).toEqual([3, 4, 5, 6]);
    expect(alphabetMappings[0].character).toBe('外字符');

    expect(generateRyakugoComment('JR')).toBe('ひらがなでは「ろち」');

    const jr = createRyakugoData('JR');
    expect(jr.subCells?.map((c) => c.character)).toEqual(['外字符', 'J', 'R']);
    expect(jr.columnSpan).toBe(3);
    expect(ryakugoMappings.length).toBeGreaterThan(0);
  });
});
