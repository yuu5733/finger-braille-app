import type { InputMode, ModeChar } from '../data/types';

import { 
  dakuonMap, 
  handakuonMap, 
  youonMap, 
  youdakuonMap, 
  youhandakuonMap,
  tokushuGimonfuMap,
  tokushuKutenMap,
  tokushu456Map
} from '../data/table';

/**
 * モードと清音文字に基づき、最終的な確定文字を返す
 * @param mode 現在の入力モード ('Dakuon', 'Handakuon', 'Kana'など)
 * @param character 清音の文字
 * @returns 変換後の文字
 */
export function getConvertedCharacter(mode: InputMode, character: string): string {
  if (character === '不明') return '不明';
    
  // 1. 濁音モードの処理
  if (mode === 'Dakuon') {
    return dakuonMap[character] || character; // マッピングがなければ清音を返す
  } 
  
  // 2. 半濁音モードの処理
  if (mode === 'Handakuon') {
    return handakuonMap[character] || character; 
  }

  // 3. 拗音モードの処理
  if (mode === 'Youon') {
    return youonMap[character] || character; 
  }
  
  // 4. 拗濁音モードの処理
  if (mode === 'YouDakuon') {
    return youdakuonMap[character] || character; 
  }

  // 5. 拗半濁音モードの処理
  if (mode === 'YouHandakuon') {
    return youhandakuonMap[character] || character; 
  }

  // 6. 特殊音（疑問符 [2,6]）モードの処理
  if (mode === 'Question') {
    // 特殊音のマップに存在しない入力（スペース、空文字、'疑問符'、その他の文字など）はすべて '？' に変換する
    return tokushuGimonfuMap[character] || '？';
  }

  // 7. 特殊音（句点 [2,5,6]）モードの処理
  if (mode === 'Kuten') {
    return tokushuKutenMap[character] || '、';
  }

  // 8. 特殊音（[4,5,6]点）モードの処理
  if (mode === 'Tokushu456') {
    return tokushu456Map[character] || character;
  }

  // 'Kana'モードなどの場合はそのまま返す
  return character;
}


/**
 * 確定したモード符の文字から、対応する次の入力モードを取得する。
 * (Suuji や Alphabet の解除、待機モードの遷移などに使用)
 * * @param modeChar 確定された文字（ModeChar型または string）
 * @returns 対応する InputMode または null
 */
export function getModeFromModeChar(modeChar: ModeChar): InputMode | null {
  // ModeChar型に限定されたマッピングテーブル
  const modeMap: { [key in ModeChar]?: InputMode } = {
    '濁音符': 'Dakuon',
    '半濁音符': 'Handakuon',
    '拗音符': 'Youon',
    '拗濁音符': 'YouDakuon',
    '拗半濁音符': 'YouHandakuon',
    '数符': 'Suuji',
    '外字符': 'Alphabet',
    // '大文字符'をここに追加するかも
    '疑問符': 'Question',
    '句点': 'Kuten',
    '[4,5,6]点': 'Tokushu456',
  };

  // modeCharが 'ModeChar' のユニオン型に含まれるかをチェックし、対応するモードを返す
  return modeMap[modeChar] ?? null;
}