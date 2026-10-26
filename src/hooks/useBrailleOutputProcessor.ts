// 1. コアライブラリ
import { useCallback } from 'react';

// 2. 型定義 (Type Imports)
import type { BrailleData, InputMode } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import { getConvertedCharacter } from '../utils/modeLogic'; 

// 6. スタイルシート / アセット

export type OutputProcessResult = {
  /** 確定処理後に入力データ (pendingData) をリセットすべきか */
  shouldResetPendingData: boolean;
  /** モード変更の指示がある場合、その新しいモード名。指示がない場合は null */
  nextMode: InputMode | null;
};

/**
 * キー解放時に入力された文字を確定し、モードに基づいて変換・出力する
 * @param pendingData 安定した入力で表示されたBrailleData
 * @param currentMode 現在のロジックモード
 * @param onOutput 確定文字出力関数
 * @param setMode 内部モードState更新関数
 * @returns { boolean } モードが維持されたかどうか
 */
export function useBrailleOutputProcessor(
  pendingData: BrailleData | null,
  currentMode: InputMode,
  onOutput: (char: string) => void,
  setMode: (newMode: InputMode) => void,
) {

  // pendingData, currentMode, onOutput, setModeが変更された時のみ再生成
  const processOutput = useCallback((): OutputProcessResult => {
    if (!pendingData) return { shouldResetPendingData: false, nextMode: null };
    // BrailleData型のcharacterプロパティは、本来符号に限定されない
    const confirmedCharacter = pendingData.character;

    // --- 1. モード維持の最優先チェック ---
    // Suujiは待機ではなく継続モードではあるが、次のボタンが押されるまでは、共通処理で良さそう
    const isModeMaintained = 
        (currentMode === 'Suuji' && confirmedCharacter === '数符') ||
        (currentMode === 'Alphabet' && confirmedCharacter === '外字符') ||
        (currentMode === 'GaijiQuote' && confirmedCharacter === '外字引用符') ||
        (currentMode === 'Dakuon' && confirmedCharacter === '濁音符') ||
        (currentMode === 'Handakuon' && confirmedCharacter === '半濁音符') ||
        (currentMode === 'Youon' && confirmedCharacter === '拗音符') ||
        (currentMode === 'YouDakuon' && confirmedCharacter === '拗濁音符') ||
        (currentMode === 'YouHandakuon' && confirmedCharacter === '拗半濁音符')||
        (currentMode === 'Question' && confirmedCharacter === '疑問符') ||
        (currentMode === 'Kuten' && confirmedCharacter === '句点') ||
        (currentMode === 'Tokushu456' && confirmedCharacter === '[4,5,6]点');
    if (isModeMaintained) {
        return { shouldResetPendingData: false, nextMode: currentMode }; // モードを維持
    }

    // --- 2. 待機モードの処理 ---
    const isWaitingMode = currentMode === 'Dakuon' || 
        currentMode === 'Handakuon' ||
        currentMode === 'Youon' || 
        currentMode === 'YouDakuon' ||
        currentMode === 'YouHandakuon' || 
        currentMode === 'Question' ||
        currentMode === 'Kuten' || 
        currentMode === 'Tokushu456';

    if (isWaitingMode) {
        // モード符ではない確定文字が入力された場合
        if (confirmedCharacter !== '数符' && confirmedCharacter !== '外字符' && 
            confirmedCharacter !== '濁音符' && confirmedCharacter !== '半濁音符' && 
            confirmedCharacter !== '拗音符' && confirmedCharacter !== '拗濁音符' && 
            confirmedCharacter !== '拗半濁音符'&& confirmedCharacter !== '疑問符' &&
            confirmedCharacter !== '句点' && confirmedCharacter !== '[4,5,6]点' ) {
            
            // 変換ロジックはユーティリティ関数に一任
            const convertedChar = getConvertedCharacter(currentMode, confirmedCharacter);
            
            if (convertedChar !== '不明') {
                onOutput(convertedChar);
            }

            // モードをリセット
            return { shouldResetPendingData: true, nextMode: 'Kana' }; // モードが変更するよう指示

        }
    } 

    // --- 3. モード共通の処理 ---l
    let nextMode: InputMode | null = null;
    
    // 確定された文字がモード符であるかを判定し、次のモードを決定
    if (confirmedCharacter === '濁音符') {
        nextMode = 'Dakuon';
    } else if (confirmedCharacter === '半濁音符') {
        nextMode = 'Handakuon';
    } else if (confirmedCharacter === '拗音符') {
        nextMode = 'Youon';
    } else if (confirmedCharacter === '拗濁音符') {
        nextMode = 'YouDakuon';
    } else if (confirmedCharacter === '拗半濁音符') {
        nextMode = 'YouHandakuon';
    } else if (confirmedCharacter === '数符') {
        nextMode = 'Suuji';
    } else if (confirmedCharacter === '外字符') {
        nextMode = 'Alphabet';
    } else if (confirmedCharacter === '外字引用符') { 
        nextMode = 'GaijiQuote';
    } else if (confirmedCharacter === '疑問符') {
        nextMode = 'Question';
    } else if (confirmedCharacter === '句点') {
        nextMode = 'Kuten';
    } else if (confirmedCharacter === '[4,5,6]点') {
        nextMode = 'Tokushu456';
    }

    if (nextMode !== null) {
        // モード符が入力された場合、モード変更を指示する
        return { shouldResetPendingData: false, nextMode: nextMode }; // モード符は pendingData を維持（useBrailleLogicで別途処理）
    }

    // --- 4. Kanaモードの処理 ---
    if (currentMode === 'Kana') {
        // モード符ではなく、清音または不明な点字の場合
        if (confirmedCharacter !== '不明') {
            onOutput(confirmedCharacter); // 清音の確定
            return { shouldResetPendingData: true, nextMode: null };
        }

        return { shouldResetPendingData: false, nextMode: null };
    }

    // --- 5. Suujiモードの処理 (数字の確定とモード継続) ---
    else if (currentMode === 'Suuji') {
        if (confirmedCharacter === '不明') {
            return { shouldResetPendingData: true, nextMode: 'Kana' };
        // '数符'自体は出力しない
        } else if (confirmedCharacter !== '数符') {
            // 数字、小数点、位取り点（アポストロフィ）が入力された場合
            // 数字モードでは変換ロジック(getConvertedCharacter)は不要。文字をそのまま出力する。
            onOutput(confirmedCharacter);
        }
        
        // モードは 'Suuji' のまま維持するが、
        // 数字の確定後は pendingData をリセットする
        return { shouldResetPendingData: true, nextMode: 'Suuji' };
    }

    // --- 6. Alphabet および GaijiQuote モードの処理 ---
    else if (currentMode === 'Alphabet'|| currentMode === 'GaijiQuote') {
        if (confirmedCharacter === '不明') {
            return { shouldResetPendingData: true, nextMode: 'Kana' };
        // '外字符'自体は出力しない
        } else if (confirmedCharacter !== '外字符') {
            // アルファベット、記号が入力された場合
            // 外字入力モードでは変換ロジック(getConvertedCharacter)は不要。文字をそのまま出力する。
            onOutput(confirmedCharacter);
        }
        
        // モードは 'Alphabet' のまま維持するが、
        // アルファベット・記号の確定後は pendingData をリセットする
        return { shouldResetPendingData: true, nextMode: currentMode };
    }

    // 上記以外の場合は pendingData をリセット
    return { shouldResetPendingData: true, nextMode: null };

}, [pendingData, currentMode, onOutput, setMode]);

  return { processOutput };
}