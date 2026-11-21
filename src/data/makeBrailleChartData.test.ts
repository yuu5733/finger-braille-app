import { describe, expect, test } from 'vitest';
import {
  seionTableData,
  kigouTableData,
  dakuonAndHandakuonTableData,
  youonTableData,
  numberTableData,
  alphabetTableData,
  tokushuTableData,
  ryakugoTableData,
} from './makeBrailleChartData';
import type { BrailleRowData } from './types';

function expectAllCellsPopulated(rows: BrailleRowData[]) {
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) {
    expect(row.category).toBeTruthy();
    expect(row.cells.length).toBeGreaterThan(0);
    for (const cell of row.cells) {
      if (cell.subCells) {
        expect(cell.subCells.length).toBeGreaterThan(0);
        for (const sub of cell.subCells) {
          expect(sub.brailleChar).not.toBe('');
        }
      } else {
        expect(cell.brailleChar).toBeTruthy();
      }
    }
  }
}

describe('makeBrailleChartData', () => {
  test('各点字表データが行とセルを持ち、空の点字文字がない', () => {
    expectAllCellsPopulated(seionTableData);
    expectAllCellsPopulated(kigouTableData);
    expectAllCellsPopulated(dakuonAndHandakuonTableData);
    expectAllCellsPopulated(youonTableData);
    expectAllCellsPopulated(numberTableData);
    expectAllCellsPopulated(alphabetTableData);
    expectAllCellsPopulated(tokushuTableData);
    expectAllCellsPopulated(ryakugoTableData);
  });

  test('清音表のあ行と数字表の数字行が期待通り構成されている', () => {
    const aRow = seionTableData.find((r) => r.category === 'あ行');
    expect(aRow?.cells.map((c) => c.character)).toEqual([
      'あ',
      'い',
      'う',
      'え',
      'お',
    ]);

    const numRow = numberTableData.find((r) => r.category === '数字');
    expect(numRow?.cells.map((c) => c.character)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
    ]);
  });
});
