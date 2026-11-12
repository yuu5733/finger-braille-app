// 1. コアライブラリ
import { useState, useEffect, useCallback, useMemo } from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type {
  BrailleData,
  InputMode,
  BrailleChar,
  BrailleCode,
} from '../../data/types';
import type { BrailleContextType } from '../../contexts/BrailleContext';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import {
  BrailleContext,
  useBrailleContext,
} from '../../contexts/BrailleContext';
import { useMobileBrailleLogic } from '../../hooks/useMobileBrailleLogic';
import MobileBrailleInput from './MobileBrailleInput';
import ResultDisplay from './ResultDisplay';
import ModeDisplay from './ModeDisplay';
import { inputModeConfigs } from '../../data/table';
import { useKeyboardListener } from '../../hooks/useKeyboardListener';

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import styles from './MobileBrailleApp.module.css';

const MobileBrailleAppContent: FC<{
  pressedKeys: Set<string>;
  onKeyPress: (key: string) => void;
  onKeyRelease: (key: string) => void;
}> = ({ pressedKeys, onKeyPress, onKeyRelease }) => {
  useMobileBrailleLogic(pressedKeys);

  const { currentMode, character, brailleChar, dots, outputString } =
    useBrailleContext();

  const [announcement, setAnnouncement] = useState('');
  const [prevLength, setPrevLength] = useState<number>(0);
  const [prevMode, setPrevMode] = useState<InputMode>('Kana');

  useEffect(() => {
    let message = '';

    if (currentMode !== prevMode) {
      const config = inputModeConfigs[currentMode];
      const modeLabel = config
        ? `${config.label} に変更。`
        : 'モードが変更されました。';
      message += modeLabel;
      setPrevMode(currentMode);
    }

    if (outputString.length > prevLength) {
      const addedChars = outputString.slice(prevLength);
      const textToRead = addedChars === ' ' ? 'スペース' : addedChars;
      message += `${textToRead} `;
    }

    if (message) {
      setAnnouncement((prev) => {
        const cleanPrev = prev.replace(/[\u200B-\u200D\uFEFF]/g, '');
        const trimmedMessage = message.trim();
        if (cleanPrev === trimmedMessage) {
          return trimmedMessage + (prev.includes('\u200B') ? '' : '\u200B');
        }
        return trimmedMessage;
      });
    }

    setPrevLength(outputString.length);
  }, [outputString, prevLength, currentMode, prevMode]);

  return (
    <>
      <div className={styles.titleWrapper}>
        <h1>指点字練習 (スマホ版)</h1>
        <p className={styles.description}>
          画面のボタンをタッチして練習できます
        </p>
      </div>
      <div className={styles.inputAreaWrapper}>
        <div className={styles.mobileModeWrapper}>
          <ModeDisplay currentMode={currentMode} />
        </div>
        <MobileBrailleInput
          pressedKeys={pressedKeys}
          onKeyPress={onKeyPress}
          onKeyRelease={onKeyRelease}
        />
      </div>

      {/* outputArea と ResultDisplay を囲むラッパー */}
      <div className={styles.bottomContainer}>
        <label htmlFor="outputArea" className={styles.outputLabel}>
          確定済み:
          <textarea
            id="outputArea"
            className={styles.outputArea}
            value={outputString}
            readOnly
          />
        </label>

        <div className={styles.resultContainer}>
          <ResultDisplay
            text={character}
            brailleChar={brailleChar}
            dots={dots}
            className={styles.resultDisplayOverride}
          />
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </>
  );
};

const MobileBrailleApp: FC = () => {
  const [currentMode, setCurrentMode] = useState<InputMode>('Kana');
  const [pendingData, setPendingData] = useState<BrailleData | null>(null);
  const [character, setCharacter] = useState('');
  const [brailleChar, setBrailleChar] = useState<BrailleChar>('');
  const [dots, setDots] = useState<BrailleCode>([]);
  const [outputString, setOutputString] = useState('');

  const keyboardKeys = useKeyboardListener();
  const [touchKeys, setTouchKeys] = useState<Set<string>>(new Set());

  const handleKeyPress = useCallback((key: string) => {
    setTouchKeys((prev) => {
      const newSet = new Set(prev);
      newSet.add(key);
      return newSet;
    });
  }, []);

  const handleKeyRelease = useCallback((key: string) => {
    setTouchKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  }, []);

  const pressedKeys = useMemo(() => {
    const combined = new Set(keyboardKeys);
    touchKeys.forEach((k) => combined.add(k));
    return combined;
  }, [keyboardKeys, touchKeys]);

  const handleOutput = useCallback((char: string) => {
    if (
      char !== '不明' &&
      char !== '濁音符' &&
      char !== '半濁音符' &&
      char !== '拗音符' &&
      char !== '拗濁音符' &&
      char !== '拗半濁音符' &&
      char !== '数符' &&
      char !== 'つなぎ符' &&
      char !== '外字符' &&
      char !== '大文字符'
    ) {
      setOutputString((prev) => prev + char);
    }
  }, []);

  const handleDisplayUpdate = useCallback((data: BrailleData) => {
    setCharacter(data.character);
    setBrailleChar(data.brailleChar ?? '');
    setDots(data.dots ?? []);
  }, []);

  const contextValue: BrailleContextType = useMemo(
    () => ({
      currentMode,
      setCurrentMode,
      pendingData,
      setPendingData,
      onOutput: handleOutput,
      onDisplayUpdate: handleDisplayUpdate,
      character,
      brailleChar,
      dots,
      outputString,
    }),
    [
      currentMode,
      pendingData,
      handleOutput,
      handleDisplayUpdate,
      character,
      brailleChar,
      dots,
      outputString,
    ]
  );

  return (
    <BrailleContext.Provider value={contextValue}>
      <MobileBrailleAppContent
        pressedKeys={pressedKeys}
        onKeyPress={handleKeyPress}
        onKeyRelease={handleKeyRelease}
      />
    </BrailleContext.Provider>
  );
};

export default MobileBrailleApp;
