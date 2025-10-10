export type BrailleCode = number[];

export type FingerStates = {
  leftIndex: boolean;
  leftMiddle: boolean;
  leftRing: boolean;
  rightIndex: boolean;
  rightMiddle: boolean;
  rightRing: boolean;
};

export type BrailleData = {
  character: string;
  braille: string;
  dots: number[];
};

export type BrailleMapping = {
  character: string;
  dots: BrailleCode;
  braille: string;
  combo?: [BrailleCode, BrailleCode];
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
  | 'GouYouon';    // 合拗音待機モード

  export type ModeChar =
  | '濁音符'
  | '半濁音符'
  | '拗音符'
  | '拗濁音符'
  | '拗半濁音符'
  | '数符'
  | '外字符'
  | '合拗音符';