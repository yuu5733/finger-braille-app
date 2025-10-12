// 1. コアライブラリ
import { useEffect, useState } from 'react';

// 2. 型定義 (Type Imports)
import type { BrailleData, InputMode, ModeChar } from '../data/types'; 

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
// --- カスタムフック
import { useBrailleContext } from '../contexts/BrailleContext';
import { useKeyboardListener } from './useKeyboardListener';
import { useBrailleInputTiming } from './useBrailleInputTiming';
import { useBrailleOutputProcessor } from './useBrailleOutputProcessor';
import { useBrailleInputMode } from './useBrailleInputMode';
import { useBrailleInputData } from './useBrailleInputData';
// --- utility関数
import { isBrailleCodeMatch, getCurrentDots } from '../utils/brailleConverter'; 
import { dotsToHex } from '../utils/dotsToHex';
import { hexToBraille } from '../utils/hexToBraille';
import { getBrailleData, getNumberData } from '../utils/brailleConverter'; // 通常の点字データを取得

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import { brailleCodes } from '../data/table'; 

const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

export function useBrailleLogic() {
  // 1. キー入力の監視
  const pressedKeys = useKeyboardListener(); 

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

  // 2. タイミング処理 (デバウンス)
  const { stabilizedKeys, isKeysReleased } = useBrailleInputTiming(pressedKeys);

  // 3. 確定ロジック (Processorの初期化)
  const { processOutput } = useBrailleOutputProcessor(
    pendingData,
    currentMode,
    onOutput,
    setCurrentMode,
  );

  // 4. モードキーの判定
  const modeData = useBrailleInputMode(stabilizedKeys);
  
  // 4. 通常の点字入力の判定
  const characterInput = useBrailleInputData(stabilizedKeys, currentMode);

  // -----------------------------------------------------
  // useEffect: メインロジック
  // -----------------------------------------------------
  useEffect(() => {
    // A. キーが全て離された場合（確定処理）
    if (isKeysReleased) {
      if (pendingData) {
        // 1. processOutputは、待機データがあれば、文字の確定処理を実行する。返値としてモードが維持されたかを返す
        const isModeMaintained = processOutput();

        // 2. 確定文字がモードキーだった時、現在とモードが異なる場合切り替える
        if (modeData !== null && stabilizedKeys !== null) {
          const { mode, char } = modeData;
          const currentDots = getCurrentDots(stabilizedKeys);

          const isModeSame = currentMode === mode;
          const isPendingDataSame = 
              pendingData !== null && 
              pendingData.character === char && 
              JSON.stringify(pendingData.dots) === JSON.stringify(currentDots);
              
          if (!isModeSame || !isPendingDataSame) {
            // 状態が異なる場合のみ更新
            setCurrentMode(mode);
          }
        }

        // 3. 確定処理後に入力待ちの状態をリセットする
        // 濁音符入力モードなどではなくなった時に、pendingDataをリセット
        if (!isModeMaintained) {
          setPendingData(null); 
          onDisplayUpdate({ character: '', braille: '', dots: [] });
        }
      } else {
        // 無限ループ防止のため、表示がすでにクリアな場合は更新しない
        if (character !== '' || dots.length > 0) {
            onDisplayUpdate({ character: '', braille: '', dots: [] });
        }
      }
      return;
    }

    // B. 安定したキー入力があった場合 (stabilizedKeysが更新されたとき)
    if (stabilizedKeys) {
      // 1. モードキーの処理
      if (modeData !== null) {
        const { mode, char, code } = modeData;
        const currentDots = getCurrentDots(stabilizedKeys); // dotsはここで再取得が必要
        const braille = hexToBraille(code);
        const displayData = { character: char, braille, dots: currentDots };

        // 比較ロジック (元のコードからそのまま移植)
        // currentMode, pendingDataの比較...
        const isModeSame = currentMode === mode;
        const isPendingDataSame = 
            pendingData !== null && 
            pendingData.character === char && 
            JSON.stringify(pendingData.dots) === JSON.stringify(currentDots);
            
        if (isModeSame && isPendingDataSame) {
            return; 
        }

        // 状態が異なる場合のみ更新
        //setCurrentMode(mode);
        onDisplayUpdate(displayData);
        setPendingData(displayData);
        return;
      }

      // 2. 通常の点字入力の処理 (modeDataがnullの場合)
      else if (characterInput !== null) {
        const { data: characterData, shouldResetMode } = characterInput;

        // (1) 画面表示と待機データの更新
        onDisplayUpdate(characterData);
        setPendingData(characterData);

        // (2) モードリセットの判定
        if (shouldResetMode && currentMode === 'Suuji') {
            // Suujiモードで不明な点字が入力された場合のみモードをKanaにリセット
            setCurrentMode('Kana'); 
            
            // Note: この時点では pendingData は '不明' のデータで上書きされています。
            // キーが離された時 (isKeysReleased) に確定処理が行われますが、
            // '不明' な点字は processOutput のロジック次第で出力がスキップされる可能性があります。
        }
      }
    }
    
  }, [isKeysReleased, 
    stabilizedKeys, 
    currentMode, 
    pendingData, 
    onDisplayUpdate, 
    setPendingData, 
    processOutput,
    character, 
    dots]);

  return { pressedKeys, currentMode };
}