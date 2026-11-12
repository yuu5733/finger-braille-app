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
import { useBrailleLogic } from '../../hooks/useBrailleMainLogic';
import BrailleInput from './BrailleInput';
import ResultDisplay from './ResultDisplay';
import ModeDisplay from './ModeDisplay';
import { inputModeConfigs } from '../../data/table';

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import styles from './BrailleApp.module.css';

// -----------------------------------------------------
// 内部コンポーネント (Contextの消費者) を定義
// -----------------------------------------------------
const BrailleAppContent: FC = () => {
  const { currentMode, character, brailleChar, dots, outputString } =
    useBrailleContext();

  const { pressedKeys } = useBrailleLogic();

  // スクリーンリーダーへの通知用ステート
  const [announcement, setAnnouncement] = useState('');
  const [prevLength, setPrevLength] = useState<number>(0);
  const [prevMode, setPrevMode] = useState<InputMode>('Kana');

  // outputString または currentMode が変更されたときに、
  // 追加された文字とモード変更の通知をまとめてスクリーンリーダーにアナウンスする
  useEffect(() => {
    let message = '';

    // 1. モード変更の検知
    if (currentMode !== prevMode) {
      const config = inputModeConfigs[currentMode];
      const modeLabel = config ? `${config.label} に変更。` : 'モードが変更されました。';
      message += modeLabel;
      setPrevMode(currentMode);
    }

    // 2. 文字追加の検知
    if (outputString.length > prevLength) {
      const addedChars = outputString.slice(prevLength);
      const textToRead = addedChars === ' ' ? 'スペース' : addedChars;
      message += `${textToRead} `;
    }

    // メッセージがある場合のみアナウンスを更新
    if (message) {
      setAnnouncement((prev) => {
        const cleanPrev = prev.replace(/[\u200B-\u200D\uFEFF]/g, '');
        const trimmedMessage = message.trim();
        // 前回と全く同じメッセージの場合は、ゼロ幅スペースを付与してDOMを強制的に変化させる
        if (cleanPrev === trimmedMessage) {
          return trimmedMessage + (prev.includes('\u200B') ? '' : '\u200B');
        }
        return trimmedMessage;
      });
    }

    setPrevLength(outputString.length);
  }, [outputString, prevLength, currentMode, prevMode]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>指点字練習</h1>
      <p className={styles.description}>
        パソコンのキーボードを使って、練習ができます
      </p>

      {/* モード表示と入力ボタン群をまとめるラッパー */}
      <div className={styles.inputAreaWrapper}>
        <ModeDisplay currentMode={currentMode} />
        <BrailleInput pressedKeys={pressedKeys} />
      </div>

      {/* 確定された文字を表示する領域 */}
      <label htmlFor="outputArea" className={styles.outputLabel}>
        確定済み:
        <textarea
          id="outputArea"
          className={styles.outputArea}
          value={outputString}
          readOnly
        />
      </label>

      {/* スクリーンリーダー用に新しく確定した文字を通知するエリア */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div className={styles.resultContainer}>
        <ResultDisplay text={character} brailleChar={brailleChar} dots={dots} />
      </div>
    </div>
  );
};

// -----------------------------------------------------
// BrailleAppがProviderの役割を果たす
// -----------------------------------------------------
const BrailleApp: FC = () => {
  const [currentMode, setCurrentMode] = useState<InputMode>('Kana');

  const [pendingData, setPendingData] = useState<BrailleData | null>(null);

  const [character, setCharacter] = useState('');
  const [brailleChar, setBrailleChar] = useState<BrailleChar>('');
  const [dots, setDots] = useState<BrailleCode>([]);

  const [outputString, setOutputString] = useState('');

  // ロジック定義
  const handleOutput = useCallback((char: string) => {
    // 確定文字列に追加すべきではない、全てのモード符と '不明' を除外する
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

  // ContextValueはuseMemoで安定させる
  const contextValue: BrailleContextType = useMemo(
    () => ({
      currentMode,
      setCurrentMode,
      pendingData,
      setPendingData,
      onOutput: handleOutput,
      onDisplayUpdate: handleDisplayUpdate,
      character, // ResultDisplay表示用（非必須だが便利）
      brailleChar, // ResultDisplay表示用
      dots, // ResultDisplay表示用
      outputString, // ResultDisplay表示用
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

  // Providerとして自分自身をラップし、コンテンツコンポーネントを描画
  return (
    <BrailleContext.Provider value={contextValue}>
      <BrailleAppContent />
    </BrailleContext.Provider>
  );
};

export default BrailleApp;
