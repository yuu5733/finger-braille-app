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
  const { stabilizedKeys, isKeysReleased } = useBrailleInputTiming(pressedKeys); // ★ NEW
  
  // 3. モード管理
  // stabilizedKeysが更新されると、モード変更キーの判定（kキー単独押下）が実行される
  // currentMode, setCurrentModeでuseContextから取り出す

  // 4. 待機データ
  // pendingData, setPendingDataから取り出す

  // 5. 確定ロジック (Processorの初期化)
  const { processOutput } = useBrailleOutputProcessor(
    pendingData,
    currentMode,
    onOutput,
    setCurrentMode,
  );

  // -----------------------------------------------------
  // useEffect: メインロジック
  // -----------------------------------------------------
  useEffect(() => {
    // A. キーが全て離された場合（確定処理）
    if (isKeysReleased) {
      if (pendingData) {
        // 1. 待機データがあれば、確定処理を実行する
        const isModeMaintained = processOutput();
        
        // 2. 確定処理後に入力待ちの状態をリセットする
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
      const currentDots = getCurrentDots(stabilizedKeys);
      // const keys = Array.from(stabilizedKeys);

      // モードキーの判定
      // 数字 ('s, j, k, l'キー = 3, 4, 5, 6点)
      const isSufuOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.suFu);

      // 外字 ('k, l' = 5, 6点)
      const isGaijiOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.gaijiFu);

      // 濁音 ('k' 単独 = 点5)
      const isDakuonOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.dakuonFu);
      
      // 半濁音 ('l' 単独 = 点6)
      const isHandakuonOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.handakuonFu);
      
      // 拗音 ('j' 単独 = 点4)
      const isYouonOnly = isBrailleCodeMatch(stabilizedKeys, brailleCodes.youonFu);

      // 拗濁音 ('k, j'キー = 点4 + 点5)
      const isYouDakuon = isBrailleCodeMatch(stabilizedKeys, brailleCodes.youdakuonFu); 
      
      // 拗半濁音 ('l, j'キー = 点4 + 点6)
      const isYouHandakuon = isBrailleCodeMatch(stabilizedKeys, brailleCodes.youhandakuonFu); 

      // モードキー共通のデータ格納変数
      let modeData: { mode: InputMode; char: ModeChar; code: number } | null = null;
      
      // memo: "Kana" | "Suuji" | "Alphabet" | "Dakuon" | "Handakuon" | "Youon" | "YouDakuon" | "YouHandakuon" | "GouYouon"
      if (isSufuOnly) { 
        // 数符 (キー)
        modeData = { mode: 'Suuji', char: '数符', code: brailleCodes.suFu };
      } 
      else if (isGaijiOnly) { 
        // 外字符 (キー)
        modeData = { mode: 'Alphabet', char: '外字符', code: brailleCodes.gaijiFu };
      } 
      else if (isDakuonOnly) { 
        // 濁音符 (kキー)
        modeData = { mode: 'Dakuon', char: '濁音符', code: brailleCodes.dakuonFu };
      } 
      else if (isHandakuonOnly) {
        // 半濁音符 (lキー)
        modeData = { mode: 'Handakuon', char: '半濁音符', code: brailleCodes.handakuonFu };
      }
      else if (isYouonOnly) {
        // 拗音符 (jキー)
        modeData = { mode: 'Youon', char: '拗音符', code: brailleCodes.youonFu };
      }
      else if (isYouDakuon) {
        // 拗濁音符 (j + kキー)
        modeData = { mode: 'YouDakuon', char: '拗濁音符', code: brailleCodes.youdakuonFu };
      }
      else if (isYouHandakuon) {
        // 拗半濁音符 (j + lキー)
        modeData = { mode: 'YouHandakuon', char: '拗半濁音符', code: brailleCodes.youhandakuonFu };
      }

      // --- Suujiモードの処理 (最優先) ---
      if (currentMode === 'Suuji') {
        const numberData = getNumberData(stabilizedKeys);

        if (numberData !== null) {
          // 数字や記号が入力された場合
          onDisplayUpdate(numberData);
          setPendingData(numberData);
          return;
        } else {
          // 数字モード中に数字・記号以外の点字が入力された場合
          const brailleText = currentDots.length > 0 ? hexToBraille(dotsToHex(currentDots)) : '';
          const displayData: BrailleData = {
              character: '不明',
              braille: brailleText,
              dots: currentDots,
          };
          onDisplayUpdate(displayData);
          setPendingData(displayData);

          // 数字モードは継続しないとみなし、Kanaモードへ戻す
          // （このpendingDataがuseBrailleOutputProcessorで処理されるのを待つ）
          setCurrentMode('Kana'); 
          return; 

        }
      }
      // ★★★ 共通処理ブロック ★★★
      else if (modeData !== null) {
        const { mode, char, code } = modeData; // データを取り出し
        
        const braille = hexToBraille(code);
        const displayData = { character: char, braille, dots: currentDots };

        // 1. currentModeが既に同じか
        const isModeSame = currentMode === mode;

        // 2. pendingDataの内容が機能的に同じか (オブジェクト参照が変わるpendingDataがキー)
        // pendingData.dots と currentDots は配列なので、JSON.stringifyで内容を比較
        const isPendingDataSame = 
            pendingData !== null && 
            pendingData.character === char && 
            // braille (点字記号) の比較はスキップし、dotsの内容が同じかチェックすることで十分
            JSON.stringify(pendingData.dots) === JSON.stringify(currentDots);
            
        // 現在の状態と設定しようとしている状態がすべて同じであれば、更新をスキップしてループを防止
        // ただし、大文字符の場合は、二重大文字符とトグルさせる予定
        if (isModeSame && isPendingDataSame) {
            return; 
        }

        // 状態が異なる場合のみ更新
        setCurrentMode(mode);
        onDisplayUpdate(displayData);
        setPendingData(displayData); // ここで新しいオブジェクトが渡されるが、次回は上記チェックで回避
        return;
      }

      // 2. 通常の点字入力判定 
      else {
        const characterData = getBrailleData(stabilizedKeys);

        if (characterData !== null) {
          onDisplayUpdate(characterData);
          setPendingData(characterData);
        } else {
          // 不明な点字の表示ロジック
          // ... (既存の不明な点字ロジックをここに移植)
          let brailleText = '';
          if (currentDots.length > 0) {
            brailleText = hexToBraille(dotsToHex(currentDots)); 
          }
          
          const displayData: BrailleData = {
              character: '不明',
              braille: brailleText,
              dots: currentDots,
          };

          onDisplayUpdate(displayData);
          setPendingData(displayData);
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