// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { InputMode, ModeChar } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import { isBrailleCodeMatch } from '../utils/brailleConverter'; 

// 6. スタイルシート / アセット
import { brailleCodes } from '../data/table';


// モードキーに関するデータを返す型
type ModeKeyResult = { 
  mode: InputMode; 
  char: ModeChar; 
  code: number; 
} | null;

export function useBrailleInputMode(stabilizedKeys: Set<string> | null): ModeKeyResult | null {
  if (!stabilizedKeys) {
    return null;
  }
  
  // 1. キーのパターンマッチング
  const isSufuOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.suFu);
  const isGaijiOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.gaijiFu);
  const isDakuonOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.dakuonFu);
  const isHandakuonOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.handakuonFu);
  const isYouonOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.youonFu);
  const isYouDakuon = isBrailleCodeMatch(stabilizedKeys, brailleCodes.youdakuonFu); 
  const isYouHandakuon = isBrailleCodeMatch(stabilizedKeys, brailleCodes.youhandakuonFu); 

  // 2. モードデータの設定
  if (isSufuOnly) { 
    return { mode: 'Suuji', char: '数符', code: brailleCodes.suFu };
  } 
  if (isGaijiOnly) { 
    return { mode: 'Alphabet', char: '外字符', code: brailleCodes.gaijiFu };
  } 
  if (isDakuonOnly) { 
    return { mode: 'Dakuon', char: '濁音符', code: brailleCodes.dakuonFu };
  } 
  if (isHandakuonOnly) {
    return { mode: 'Handakuon', char: '半濁音符', code: brailleCodes.handakuonFu };
  }
  if (isYouonOnly) {
    return { mode: 'Youon', char: '拗音符', code: brailleCodes.youonFu };
  }
  if (isYouDakuon) {
    return { mode: 'YouDakuon', char: '拗濁音符', code: brailleCodes.youdakuonFu };
  }
  if (isYouHandakuon) {
    return { mode: 'YouHandakuon', char: '拗半濁音符', code: brailleCodes.youhandakuonFu };
  }
  
  return null;
}