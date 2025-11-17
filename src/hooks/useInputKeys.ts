import { useKeyboardListener } from './useKeyboardListener';

// 戻り値の型定義: 押されているキーのSetと、入力の発生源
export interface InputKeysResult {
  pressedKeys: Set<string>;
  isTouchInput: boolean; // タッチ入力の場合に true
}

/**
 * キーボード入力とタッチ入力の両方を監視し、統合された入力状態を提供するカスタムフック。
 * どちらか一方の入力のみがアクティブになることを前提とする。
 * @returns InputKeysResult: 押されているキーのSetと、入力がタッチによるものかどうかのフラグ
 */
export function useInputKeys(touchKeys: Set<string>): InputKeysResult {
  // 1. キーボード入力の取得
  const keyboardKeys = useKeyboardListener();
  
  // 2. 統合されたキーセットを返す
  if (keyboardKeys.size > 0) {
    // キーボードが押されている場合はキーボードの入力を優先
    return { pressedKeys: keyboardKeys, isTouchInput: false };
  } else {
    // キーボードが押されていない場合はタッチ入力を返す（タッチ操作がない場合は空のSetとisTouchInput: trueを返す）
    return { pressedKeys: touchKeys, isTouchInput: true };
  }
}