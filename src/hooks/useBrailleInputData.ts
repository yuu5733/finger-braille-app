import type { BrailleData, InputMode } from '../data/types';

import { getBrailleData, getNumberData, getAlphabetData, getCurrentDots, isBrailleCodeMatch } from '../utils/brailleConverter';
import { dotsToHex } from '../utils/dotsToHex';
import { hexToBraille } from '../utils/hexToBraille';
import { brailleCodes } from '../data/table'; 

type BrailleInputResult = {
  data: BrailleData;
} | null;

/**
 * リアルタイムで、現在の入力モード（Kana, Suuji, Alphabetなど）と安定したキー入力に基づいて、
 * 確定前の表示データ（pendingData）を決定するカスタムフックです。
 *
 * キー解放を待たずに、安定したキー入力（StabilizedKeys）に即座に対応する文字データを生成します。
 *
 * @param stabilizedKeys - useBrailleInputTimingから提供される、デバウンスされた安定入力キーのSet。キーが離されている場合は null。
 * @param currentMode - 現在の点字入力モード（例: 'Kana', 'Suuji', 'Alphabet'）。
 * @returns { BrailleInputResult | null } 判定された BrailleData（確定前文字、点字、点配列）を含むオブジェクト、または入力がない場合は null。
 */
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
    
    // 2. 数字・記号への変換
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

  // --- Alphabetモードの処理 ---
  if (currentMode === 'Alphabet') {
    // 1. 外字符が押された場合 (0x30)
    if (isBrailleCodeMatch(stabilizedKeys, brailleCodes.gaijiFu)) {
      // 外字符自体はここではモードデータではないが、Alphabetモードの特殊入力として扱う

      const data: BrailleData = {
          character: '外字符',
          braille: hexToBraille(brailleCodes.gaijiFu),
          dots: currentDots,
      };

      return { data }; 
    } 
    
    // 2. アルファベット・記号への変換
    const alphabetData = getAlphabetData(stabilizedKeys);
    if (alphabetData !== null) {
      return { data: alphabetData };
    } 

    // 3. Alphabetモードで不明な点字の場合
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