import { useEffect, useRef } from 'react';
import type { BrailleCode } from '../data/types.ts';
import { useBrailleContext } from '../contexts/BrailleContext';
import { useBrailleOutputProcessor } from './useBrailleOutputProcessor';
import { useBrailleInputMode } from './useBrailleInputMode';
import { useBrailleInputData } from './useBrailleInputData';
import { getCurrentDots } from '../utils/brailleConverter';
import { hexToBraille } from '../utils/hexToBraille';

const EMPTY_DOTS: BrailleCode = [];

export function useMobileBrailleLogic(pressedKeys: Set<string>) {
  const {
    currentMode,
    setCurrentMode,
    pendingData,
    setPendingData,
    onOutput,
    onDisplayUpdate,
    character,
    dots,
  } = useBrailleContext();

  const prevSpacePressedRef = useRef(false);

  // スペースキーの処理
  useEffect(() => {
    const isSpacePressed = pressedKeys.has(' ');

    if (isSpacePressed && !prevSpacePressedRef.current) {
      const isWaitingMode =
        currentMode === 'Dakuon' ||
        currentMode === 'Handakuon' ||
        currentMode === 'Youon' ||
        currentMode === 'YouDakuon' ||
        currentMode === 'YouHandakuon' ||
        currentMode === 'Question' ||
        currentMode === 'Kuten' ||
        currentMode === 'Tokushu456';

      if (pendingData) {
        if (pendingData.character && pendingData.character !== '不明') {
          let charToOutput = pendingData.character;
          if (currentMode === 'Question' && charToOutput === '疑問符') {
            charToOutput = '？';
          } else if (currentMode === 'Kuten' && charToOutput === '句点') {
            charToOutput = '。';
          }
          onOutput(charToOutput);
        }
        setPendingData(null);
      }

      if (
        currentMode === 'Alphabet' ||
        currentMode === 'Suuji' ||
        isWaitingMode
      ) {
        setCurrentMode('Kana');
        onOutput(' ');
      } else {
        onOutput(' ');
      }
    }

    prevSpacePressedRef.current = isSpacePressed;
  }, [
    pressedKeys,
    currentMode,
    pendingData,
    setCurrentMode,
    setPendingData,
    onOutput,
  ]);

  // スマホ版ではデバウンスをせず、pressedKeys をそのまま stabilizedKeys として扱う
  const isKeysReleased = pressedKeys.size === 0;
  const stabilizedKeys = isKeysReleased ? null : pressedKeys;

  const { processOutput } = useBrailleOutputProcessor(
    pendingData,
    currentMode,
    onOutput,
    setCurrentMode
  );

  const stabilizedModeData = useBrailleInputMode(stabilizedKeys);
  const characterInput = useBrailleInputData(stabilizedKeys, currentMode);

  useEffect(() => {
    if (isKeysReleased) {
      if (pendingData) {
        const { shouldResetPendingData, nextMode } = processOutput();

        if (nextMode !== null && currentMode !== nextMode) {
          setCurrentMode(nextMode);
        }

        if (shouldResetPendingData) {
          setPendingData(null);
          onDisplayUpdate({ character: '', brailleChar: '', dots: EMPTY_DOTS });
        }
      } else {
        if (character !== '' || dots.length > 0) {
          onDisplayUpdate({ character: '', brailleChar: '', dots: EMPTY_DOTS });
        }
      }
      return;
    }

    if (stabilizedKeys) {
      if (stabilizedModeData !== null) {
        const { mode, char, hexCode } = stabilizedModeData;
        const currentDots = getCurrentDots(stabilizedKeys);
        const brailleChar = hexToBraille(hexCode);
        const displayData = { character: char, brailleChar, dots: currentDots };

        const isModeSame = currentMode === mode;
        const isPendingDataSame =
          pendingData !== null &&
          pendingData.character === char &&
          JSON.stringify(pendingData.dots) === JSON.stringify(currentDots);

        if (isModeSame && isPendingDataSame) {
          return;
        }

        onDisplayUpdate(displayData);
        setPendingData(displayData);
        return;
      } else if (characterInput !== null) {
        const { data: characterData } = characterInput;
        onDisplayUpdate(characterData);
        setPendingData(characterData);
      }
    }
  }, [
    isKeysReleased,
    stabilizedKeys,
    currentMode,
    onDisplayUpdate,
    setPendingData,
    pendingData,
    processOutput,
    character,
    dots,
    setCurrentMode,
    stabilizedModeData,
    characterInput,
  ]);

  return { currentMode };
}
