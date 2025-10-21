// 1. コアライブラリ
import { useEffect, useState } from 'react';

// 2. 型定義 (Type Imports)

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
// --- カスタムフック
import { useBrailleContext } from '../contexts/BrailleContext';
import { useInputKeys } from './useInputKeys';
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

export function useBrailleLogic() {
  // 1. キー入力の監視
  const { pressedKeys, isTouchInput } = useInputKeys(); 

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
  const { stabilizedKeys, isKeysReleased } = useBrailleInputTiming(pressedKeys, isTouchInput);

  // 3. 確定ロジック (Processorの初期化)
  const { processOutput } = useBrailleOutputProcessor(
    pendingData,
    currentMode,
    onOutput,
    setCurrentMode,
  );

  // 4. モードキーの判定
  const stabilizedModeData = useBrailleInputMode(stabilizedKeys);
  
  // 5. 通常の点字入力の判定
  const characterInput = useBrailleInputData(stabilizedKeys, currentMode);

  // -----------------------------------------------------
  // useEffect: メインロジック
  // -----------------------------------------------------
  useEffect(() => {
    // A. キーが全て離された場合（確定処理）
    if (isKeysReleased) {
      if (pendingData) {
        // 1. processOutputを実行し、確定処理の結果を受け取る
        const { shouldResetPendingData, nextMode } = processOutput();

        // 2. モード変更が必要な場合、ここで currentMode を更新する
        if (nextMode !== null && currentMode !== nextMode) {
          setCurrentMode(nextMode);
        }

        // 3. 確定処理後に入力待ちの状態をリセットする
        // 濁音符入力モードなどではなくなった時や
        // 継続モード（数字やアルファベット）で不明な文字の時、pendingDataをリセット
        if (shouldResetPendingData) {
          setPendingData(null); 
          onDisplayUpdate({ character: '', braille: '', dots: [] });
        }

      }
      else {
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
      if (stabilizedModeData !== null) {
        const { mode, char, code } = stabilizedModeData;
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

        onDisplayUpdate(displayData);
        setPendingData(displayData);
        return;
      }

      // 2. 通常の点字入力（モードキー以外）の処理 (stabilizedModeDataがnullの場合)
      else if (characterInput !== null) {
        // モードに合わせて変換済のデータを受け取る
        const { data: characterData } = characterInput;

        // 画面表示と待機データの更新
        onDisplayUpdate(characterData);
        setPendingData(characterData);
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