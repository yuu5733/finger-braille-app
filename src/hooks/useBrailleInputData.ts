import type { BrailleData, InputMode } from '../data/types';

import { getBrailleData, getNumberData, getCurrentDots, isBrailleCodeMatch } from '../utils/brailleConverter';
import { dotsToHex } from '../utils/dotsToHex';
import { hexToBraille } from '../utils/hexToBraille';
import { brailleCodes } from '../data/table'; 

type BrailleInputResult = {
  data: BrailleData;
} | null;

// リアルタイムで、モードに合わせて文字を確定する関数
export function useBrailleInputData(
  stabilizedKeys: Set<string> | null, 
  currentMode: InputMode
): BrailleInputResult | null {
  if (!stabilizedKeys) {
    return null;
  }
  
  const currentDots = getCurrentDots(stabilizedKeys);

  // --- Suujiモードの処理 ---
  if (currentMode === 'Suuji') {
    // 1. 数符が押された場合 (0x3C)
    if (isBrailleCodeMatch(stabilizedKeys, brailleCodes.suufu)) {
      // 数符自体はここではモードデータではないが、Suujiモードの特殊入力として扱う

      const data: BrailleData = {
          character: '数符',
          braille: hexToBraille(brailleCodes.suufu),
          dots: currentDots,
      };

      return { data }; 
    } 
    
    // 2. 数字の判定を試みる
    const numberData = getNumberData(stabilizedKeys);
    if (numberData !== null) {
      return { data: numberData };
    } 

    // 3. Suujiモードで不明な点字の場合
    let brailleText = '';
    if (currentDots.length > 0) {
      brailleText = hexToBraille(dotsToHex(currentDots)); 
    }
    const unknownData: BrailleData = {
      character: '不明',
      braille: brailleText,
      dots: currentDots,
    };

    return { data: unknownData }; 
  }

  // --- 通常の点字入力判定 (Kana) ---
  else {
    const characterData = getBrailleData(stabilizedKeys);
    if (characterData !== null) {
      return { data: characterData };
    }
  }

  // ---通常モードで不明な点字の表示ロジック ---
  let brailleText = '';
  if (currentDots.length > 0) {
    brailleText = hexToBraille(dotsToHex(currentDots)); 
  }

  const unknownData: BrailleData = {
    character: '不明',
    braille: brailleText,
    dots: currentDots,
  };

  return { data: unknownData };
}