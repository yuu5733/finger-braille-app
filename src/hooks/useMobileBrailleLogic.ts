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

    if (prevKeys.size > 0 && currentKeys.size === 0) {
      console.log('[useMobileLogic] Keys released! Processing output...');
      // ...
    }

    prevPressedKeysRef.current = new Set(pressedKeys);
  }, [pressedKeys, currentMode, onOutput, onDisplayUpdate, setCurrentMode]);

  return { currentMode };
}
