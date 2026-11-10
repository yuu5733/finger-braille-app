import { useEffect, useRef } from 'react';
import type { BrailleCode } from '../data/types.ts';
import { useBrailleContext } from '../contexts/BrailleContext';
import { getBrailleData, getCurrentDots } from '../utils/brailleConverter';
import { hexToBraille } from '../utils/hexToBraille';
import { dotsToHex } from '../utils/dotsToHex';

const EMPTY_DOTS: BrailleCode = [];

export function useMobileBrailleLogic(pressedKeys: Set<string>) {
  console.log('[useMobileLogic] current pressedKeys:', Array.from(pressedKeys));

  const { currentMode, setCurrentMode, onOutput, onDisplayUpdate } =
    useBrailleContext();

  const prevPressedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const prevKeys = prevPressedKeysRef.current;
    const currentKeys = pressedKeys;

    console.log(
      '[useMobileLogic] effect triggered. prevKeys:',
      Array.from(prevKeys),
      'currentKeys:',
      Array.from(currentKeys)
    );

    // 指を離した瞬間（前回キーがあったが、今回0個になった場合）
    if (prevKeys.size > 0 && currentKeys.size === 0) {
      console.log(
        '[useMobileLogic] Keys released! prevKeys was:',
        Array.from(prevKeys)
      );

      if (prevKeys.has(' ')) {
        console.log('[useMobileLogic] Outputting space');
        onOutput(' ');
        setCurrentMode('Kana');
      } else {
        const currentDots = getCurrentDots(prevKeys);
        console.log(
          '[useMobileLogic] calculated dots from prevKeys:',
          currentDots
        );

        if (currentDots.length > 0) {
          const characterData = getBrailleData(prevKeys);
          console.log('[useMobileLogic] getBrailleData result:', characterData);

          if (characterData && characterData.character !== '不明') {
            console.log(
              '[useMobileLogic] Outputting character:',
              characterData.character
            );
            onOutput(characterData.character);
          } else {
            console.log(
              '[useMobileLogic] Character was unknown or null, no output.'
            );
          }
        }
      }

      onDisplayUpdate({ character: '', brailleChar: '', dots: EMPTY_DOTS });
    } else if (currentKeys.size > 0) {
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
