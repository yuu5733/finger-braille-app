// 1. コアライブラリ
import { useState, useCallback, useMemo } from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleData, InputMode, BrailleCode } from '../../data/types';
import type { BrailleContextType } from '../../contexts/BrailleContext';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { BrailleContext, useBrailleContext } from '../../contexts/BrailleContext'; 
import { useBrailleLogic } from '../../hooks/useBrailleMainLogic';
import { useTouchListener } from '../../hooks/useTouchListener';
import BrailleInput from "./BrailleInput";
import ResultDisplay from "./ResultDisplay";
import ModeDisplay from './ModeDisplay'; 

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット

// 7. Debug用（仮のモジュール）
import DebugOutput from './DebugOutput';

// -----------------------------------------------------
// ★ 内部コンポーネント (Contextの消費者) を定義
// -----------------------------------------------------
const BrailleAppContent: FC = () => {
  const { currentMode, character, braille, dots, outputString, touchPressedKeys } = useBrailleContext();

  const { pressedKeys } = useBrailleLogic(touchPressedKeys);

  return (
    <>
      <h1>指点字練習アプリ</h1>
      <div className="input-area-wrapper">
        <ModeDisplay currentMode={currentMode} /> 
        <BrailleInput pressedKeys={pressedKeys} />
      </div>
      <ResultDisplay character={character} braille={braille} dots={dots} />
      <div style={{ padding: '10px', border: '1px solid #ccc', margin: '1rem 0' }}>
        確定済み: {outputString}
      </div> 
    </>
  );
};

// -----------------------------------------------------
// ★ BrailleAppがProviderの役割を果たす (State管理をここに移植)
// -----------------------------------------------------
const BrailleApp: FC = () => {
    const [currentMode, setCurrentMode] = useState<InputMode>('Kana');

    const [pendingData, setPendingData] = useState<BrailleData | null>(null);

    const [character, setCharacter] = useState('');
    const [braille, setBraille] = useState('');
    const [dots, setDots] = useState<BrailleCode>([]);

    const [outputString, setOutputString] = useState('');

    // useTouchListener を実行
    const { pressedKeys: touchPressedKeys, handlePressChange } = useTouchListener();
    
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
        setBraille(data.braille);
        setDots(data.dots);
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
        touchPressedKeys,
        handlePressChange,
      }), [currentMode, pendingData, handleOutput, handleDisplayUpdate, character, braille, dots, outputString, touchPressedKeys, handlePressChange]);

    // Providerとして自分自身をラップし、コンテンツコンポーネントを描画
    return (
        <BrailleContext.Provider value={contextValue}>
            <BrailleAppContent />
            {/* 💡 デバッグ情報を追加 */}
            {process.env.NODE_ENV === 'development' && <DebugOutput />}
        </BrailleContext.Provider>
    );
};

export default BrailleApp;