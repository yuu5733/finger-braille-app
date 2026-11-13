import { useEffect, useRef } from 'react';

import type { BrailleCode } from '../data/types.ts';

import { useBrailleContext } from '../contexts/BrailleContext';
import { useBrailleOutputProcessor } from './useBrailleOutputProcessor';
import { useBrailleInputMode } from './useBrailleInputMode';
import { useBrailleInputData } from './useBrailleInputData';
import { getCurrentDots } from '../utils/brailleConverter';
import { hexToBraille } from '../utils/hexToBraille';
import { dotsToHex } from '../utils/dotsToHex';

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

  // 連続入力を防ぐためのクールダウン用Refと閾値 (ms)
  const lastProcessedTimeRef = useRef<number>(0);
  const DEBOUNCE_TIME = 250;

  // スペースキーの処理
  useEffect(() => {
    const isSpacePressed = pressedKeys.has(' ');

    if (isSpacePressed && !prevSpacePressedRef.current) {
      // const now = Date.now();
      // if (now - lastProcessedTimeRef.current < DEBOUNCE_TIME) {
      //   return;
      // }
      // lastProcessedTimeRef.current = now;

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

  // マルチタッチ対応：指が触れている間に押されたキーを蓄積
  const accumulatedKeysRef = useRef<Set<string>>(new Set());
  const prevPressedKeysSizeRef = useRef<number>(0);

  const currentSize = pressedKeys.size;
  const prevSize = prevPressedKeysSizeRef.current;

  if (currentSize > 0) {
    pressedKeys.forEach((k) => accumulatedKeysRef.current.add(k));
  }

  const stabilizedKeys = currentSize > 0 ? accumulatedKeysRef.current : null;

  const { processOutput } = useBrailleOutputProcessor(
    pendingData,
    currentMode,
    onOutput,
    setCurrentMode
  );

  const stabilizedModeData = useBrailleInputMode(stabilizedKeys);
  const characterInput = useBrailleInputData(stabilizedKeys, currentMode);

  useEffect(() => {
    // 指がすべて離された瞬間
    if (prevSize > 0 && currentSize === 0) {
      const now = Date.now();
      if (now - lastProcessedTimeRef.current < DEBOUNCE_TIME) {
        accumulatedKeysRef.current.clear();
        return;
      }
      lastProcessedTimeRef.current = now;

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

      accumulatedKeysRef.current.clear();
      return;
    }

    // 押している最中のプレビューおよびモード移行判定
    if (stabilizedKeys && stabilizedKeys.size > 0) {
      if (stabilizedModeData !== null) {
        const { mode, char, hexCode } = stabilizedModeData;
        const currentDots = getCurrentDots(stabilizedKeys);
        const brailleChar = hexToBraille(dotsToHex(currentDots));
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

    prevPressedKeysSizeRef.current = currentSize;
  }, [
    currentSize,
    prevSize,
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
