export type FingerStates = {
  leftIndex: boolean;
  leftMiddle: boolean;
  leftRing: boolean;
  rightIndex: boolean;
  rightMiddle: boolean;
  rightRing: boolean;
};

/**
 * 点字の点の番号を表現する型 (1 から 6 のいずれか)
 */
export type BrailleDot = 1 | 2 | 3 | 4 | 5 | 6; 

export type BrailleCode = BrailleDot[];

export type SubCellData = {
  character: string;    // 例: 拗音符、あるいは各文字
  braille: string;      // Unicode点字
  dots: BrailleCode;    // 点番号の配列
};

export type BrailleData = {
  character: string;          // 複数の場合セル全体が表す文字（例: "きゃ", "ATM"）
  braille?: string;           // 単一の場合の点字
  dots?: BrailleCode;         // 単一の場合の点
  subCells?: SubCellData[];   // 複数の点字を並べる場合（拗音や略語）
  columnSpan?: number;        // グリッドの占有列数（2倍、3倍の幅にするため）
  comment?: string;           // コメント
};

export type InputMode =
  | 'Kana'         // 基本のがな入力モード
  | 'Suuji'        // 数字モード
  | 'Alphabet'     // 外来語 (英字モード)
  | 'Dakuon'       // 濁音待機モード
  | 'Handakuon'    // 半濁音待機モード
  | 'Youon'        // 拗音待機モード
  | 'YouDakuon'    // 拗濁音待機モード
  | 'YouHandakuon' // 拗半濁音待機モード

  export type ModeChar =
  | '濁音符'
  | '半濁音符'
  | '拗音符'
  | '拗濁音符'
  | '拗半濁音符'
  | '数符'
  | '外字符';

/** 表をカテゴリ（行）ごとにまとめるための型 */
export interface BrailleRowData {
    category: string; // 例: 'あ行'
    cells: BrailleData[];
}