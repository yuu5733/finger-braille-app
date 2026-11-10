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

  // 指が触れている間に押されたすべてのキーを蓄積するセッション用のRef
  const accumulatedKeysRef = useRef<Set<string>>(new Set());
  const prevPressedKeysSizeRef = useRef<number>(0);

  useEffect(() => {
    const currentSize = pressedKeys.size;
    const prevSize = prevPressedKeysSizeRef.current;

    // 1. 新しく指が触れ始めた、または押している最中：キーを蓄積する
    if (currentSize > 0) {
      pressedKeys.forEach((k) => accumulatedKeysRef.current.add(k));

      // リアルタイム表示用の更新
      const currentDots = getCurrentDots(accumulatedKeysRef.current);
      if (currentDots.length > 0) {
        const characterData = getBrailleData(accumulatedKeysRef.current);
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

    // 2. 指がすべて離された瞬間（サイズが 1以上 から 0 になった時）
    if (prevSize > 0 && currentSize === 0) {
      const finalKeys = accumulatedKeysRef.current;
      console.log(
        '[useMobileLogic] All fingers released. Final keys:',
        Array.from(finalKeys)
      );

      if (finalKeys.has(' ')) {
        onOutput(' ');
        setCurrentMode('Kana');
      } else {
        const currentDots = getCurrentDots(finalKeys);
        if (currentDots.length > 0) {
          const characterData = getBrailleData(finalKeys);
          if (characterData && characterData.character !== '不明') {
            onOutput(characterData.character);
          }
        }
      }

      // 蓄積をクリアして表示をリセット
      accumulatedKeysRef.current.clear();
      onDisplayUpdate({ character: '', brailleChar: '', dots: EMPTY_DOTS });
    }

    prevPressedKeysSizeRef.current = currentSize;
  }, [pressedKeys, currentMode, onOutput, onDisplayUpdate, setCurrentMode]);

  return { currentMode };
}
