import { useEffect, useRef } from 'react';
import type { BrailleCode } from '../data/types.ts';
import { useBrailleContext } from '../contexts/BrailleContext';
import { getBrailleData, getCurrentDots } from '../utils/brailleConverter';
import { hexToBraille } from '../utils/hexToBraille';
import { dotsToHex } from '../utils/dotsToHex';

const EMPTY_DOTS: BrailleCode = [];

export function useMobileBrailleLogic(pressedKeys: Set<string>) {
  const { currentMode, setCurrentMode, onOutput, onDisplayUpdate } =
    useBrailleContext();

  const prevPressedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const prevKeys = prevPressedKeysRef.current;
    const currentKeys = pressedKeys;

    // 前回のキー数が 1個以上あり、今回のキー数が 0個（＝指を離した瞬間）になった場合
    if (prevKeys.size > 0 && currentKeys.size === 0) {
      // スペースキー単体、またはスペースが含まれている場合
      if (prevKeys.has(' ')) {
        onOutput(' ');
        setCurrentMode('Kana');
      } else {
        // 点字キーの組み合わせからデータを取得
        const currentDots = getCurrentDots(prevKeys);
        if (currentDots.length > 0) {
          const characterData = getBrailleData(prevKeys);
          if (characterData && characterData.character !== '不明') {
            onOutput(characterData.character);
          }
        }
      }

      // 表示をクリア
      onDisplayUpdate({ character: '', brailleChar: '', dots: EMPTY_DOTS });
    } else if (currentKeys.size > 0) {
      // 押している最中のリアルタイム表示用
      const currentDots = getCurrentDots(currentKeys);
      if (currentDots.length > 0) {
        const characterData = getBrailleData(currentKeys);
        if (characterData) {
          onDisplayUpdate(characterData);
        } else {
          onDisplayUpdate({
            character: '不明',
            brailleChar: hexToBraille(dotsToHex(currentDots)),
            dots: currentDots,
          });
        }
      }
    }

    prevPressedKeysRef.current = new Set(pressedKeys);
  }, [pressedKeys, currentMode, onOutput, onDisplayUpdate, setCurrentMode]);

  return { currentMode };
}
