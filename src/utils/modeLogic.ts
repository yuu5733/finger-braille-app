import type { InputMode } from '../data/types';
import { dakuonMap, handakuonMap, youonMap, youdakuonMap, youhandakuonMap } from '../data/table';

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

  // 'Kana'モードなどの場合はそのまま返す
  return character;
}

/**
 */
