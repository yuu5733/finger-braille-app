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
  character: string;          // 複数の場合セル全体が表す文字（例: "きゃ", "ATM"）、単数の場合は表示する文字（ひらがな、記号など）
  braille?: string;           // 単一の場合、対応する点字の Unicode 文字（例: '⠁'）
  dots?: BrailleCode;         // 単一の場合、点字の点番号（1〜6）の配列
  subCells?: SubCellData[];   // 複数の点字（セル）を並べる場合（拗音や略語など）
  columnSpan?: number;        // グリッドの占有列数（2倍、3倍の幅にするため）
  comment?: string;           // コメント
};

export type InputMode =
  | 'Kana'         // 基本のがな入力モード
  | 'Suuji'        // 数字モード
  | 'Alphabet'     // 外来語 (英字モード)
  | 'GaijiQuote'   // 外字引用符モード
  | 'Dakuon'       // 濁音待機モード
  | 'Handakuon'    // 半濁音待機モード
  | 'Youon'        // 拗音待機モード
  | 'YouDakuon'    // 拗濁音待機モード
  | 'YouHandakuon' // 拗半濁音待機モード
  | 'Question'     // 特殊音（疑問符 [2,6]）待機モード
  | 'Kuten'        // 特殊音（句点 [2,5,6]）待機モード
  | 'Tokushu456';  // 特殊音（[4,5,6]点）待機モード

  export type ModeChar =
  | '濁音符'
  | '半濁音符'
  | '拗音符'
  | '拗濁音符'
  | '拗半濁音符'
  | '数符'
  | '外字符'
  | '外字引用符'
  | '疑問符'
  | '句点'
  | '[4,5,6]点';

/** 表をカテゴリ（行）ごとにまとめるための型 */
export interface BrailleRowData {
    category: string; // 例: 'あ行'
    cells: BrailleData[];
}

/**
 * svgで色設定するための点字の種別（ひらがな、や行、英字、数字、記号）
 */
export type BrailleColorType = 'hiragana' | 'yagyou' | 'wagyou' | 'alphabet' | 'number' | 'kigou';