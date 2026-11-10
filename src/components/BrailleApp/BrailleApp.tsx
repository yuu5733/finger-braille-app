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

  // outputString が更新されたときに、新しく追加された文字を検知して
  // スクリーンリーダにアナウンスを設定
  useEffect(() => {
    if (outputString.length > prevLength) {
      const addedChars = outputString.slice(prevLength);
      // スペースの場合は読みやすく調整
      const textToRead = addedChars === ' ' ? 'スペース' : addedChars;
      const baseMessage = `${textToRead} `;

      // 前回と同じアナウンス内容であっても確実に再読み上げさせるため、
      // 偶数回目・奇数回目でゼロ幅スペースをトグルして文字列を変化させる
      setAnnouncement((prev) => {
        const cleanPrev = prev.replace(/[\u200B-\u200D\uFEFF]/g, '');
        // 既存のゼロ幅スペースを除去して比較
        if (cleanPrev === baseMessage) {
          // 前回と全く同じメッセージの場合は、ゼロ幅スペースを付与してDOMを強制的に変化させる
          return baseMessage + (prev.includes('\u200B') ? '' : '\u200B');
        }
        return baseMessage;
      });
    }
    setPrevLength(outputString.length);
  }, [outputString, prevLength]);

  // currentMode が変更されたときにスクリーンリーダーに通知
  useEffect(() => {
    if (currentMode !== prevMode) {
      const config = inputModeConfigs[currentMode];
      const label = config ? config.label : 'モードが変更されました';

      setAnnouncement(`${label} に変更`);
      setPrevMode(currentMode);
    }
  }, [currentMode, prevMode]);

  return (
    <>
      <h1>指点字練習</h1>
      <p className={styles.description}>
        パソコンのキーボドを使って、練習ができます
      </p>
      <div className="input-area-wrapper">
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

      <ResultDisplay text={character} brailleChar={brailleChar} dots={dots} />
    </>
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
