// 1. コアライブラリ
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleData, InputMode } from '../../data/types';
import type { BrailleContextType } from '../../contexts/BrailleContext';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { BrailleContext, useBrailleContext } from '../../contexts/BrailleContext'; 
import { useBrailleLogic } from '../../hooks/useBrailleMainLogic';
import BrailleInput from "./BrailleInput";
import ResultDisplay from "./ResultDisplay";
import ModeDisplay from './ModeDisplay'; 

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット

// -----------------------------------------------------
// 内部コンポーネント (Contextの消費者) を定義
// -----------------------------------------------------
const BrailleAppContent: FC = () => {
  const { currentMode, setCurrentMode, pendingData, setPendingData, character, braille, dots, outputString, onOutput } = useBrailleContext();

  const { pressedKeys } = useBrailleLogic();

  // スペースキーの二重発火を防ぐための参照
  // useStateではなく、useRefを使うことで、コンポーネントは再描画されない
  // コンポーネントが再描画されても、値がリセットされず保持される
  const prevSpacePressedRef = useRef(false);

  // スペースキー押下時のハンドリング
  useEffect(() => {
    const isSpacePressed = pressedKeys.has(' ');

    // 押された瞬間（立ち上がり）を検知
    if (isSpacePressed && !prevSpacePressedRef.current) {
      // 1. pendingData があれば確定する
      if (pendingData) {
        if (pendingData.character && pendingData.character !== '不明') {
          let charToOutput = pendingData.character;
          
          // 特殊音待機モードでモード名（「疑問符」「句点」など）になっている場合は記号に変換
          if (currentMode === 'Question' && charToOutput === '疑問符') {
            charToOutput = '？';
          } else if (currentMode === 'Kuten' && charToOutput === '句点') {
            charToOutput = '。';
          }
          
          onOutput(charToOutput);
        }
        setPendingData(null);
      }

      // 2. モードに応じた処理の分岐
      if (currentMode === 'Alphabet') {
        // Alphabet モードではモードをリセット
        setCurrentMode('Kana');
      } else if (currentMode === 'GaijiQuote') {
        // 外字引用符モードの時は半角スペースを追加
        onOutput(' ');
      } else {
        // その他の通常モードでは全角スペースを追加
        onOutput('　');
      }
    }

    prevSpacePressedRef.current = isSpacePressed;
  }, [pressedKeys, currentMode, pendingData, setCurrentMode, setPendingData, onOutput]);

  return (
    <>
      <h1>指点字練習アプリ</h1>
      <div className="input-area-wrapper">
        <ModeDisplay currentMode={currentMode} /> 
        <BrailleInput pressedKeys={pressedKeys} />
      </div>
      {/* 確定された文字を表示するための新しい領域 */}
      <div style={{ padding: '10px', border: '1px solid #ccc', margin: '1rem 0' }}>
        確定済み: {outputString}
      </div> 
      <ResultDisplay text={character} brailleText={braille} dots={dots} />
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
    const [braille, setBraille] = useState('');
    const [dots, setDots] = useState<number[]>([]);

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
        setOutputString(prev => prev + char);
    }
}, []);
    
    const handleDisplayUpdate = useCallback((data: BrailleData) => {
        setCharacter(data.character);
        setBraille(data.braille ?? '');
        setDots(data.dots ?? []);
    }, []);

    // ContextValueはuseMemoで安定させる
    const contextValue: BrailleContextType = useMemo(() => ({
        currentMode, setCurrentMode,
        pendingData, setPendingData,
        onOutput: handleOutput, 
        onDisplayUpdate: handleDisplayUpdate,
        character,   // ResultDisplay表示用（非必須だが便利）
        braille,     // ResultDisplay表示用
        dots,        // ResultDisplay表示用
        outputString,// ResultDisplay表示用
    }), [currentMode, pendingData, handleOutput, handleDisplayUpdate, character, braille, dots, outputString]);

    // Providerとして自分自身をラップし、コンテンツコンポーネントを描画
    return (
        <BrailleContext.Provider value={contextValue}>
            <BrailleAppContent />
        </BrailleContext.Provider>
    );
};

export default BrailleApp;