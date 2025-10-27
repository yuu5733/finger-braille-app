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
  
  console.log(`[InputKeys] KBD Size: ${keyboardKeys.size}, Touch Size: ${touchKeys.size}`);

  // 3. 入力ソースの決定
  // どちらか一方の入力のみがアクティブであると仮定
  const isTouchInput = touchKeys.size > 0 || (touchKeys.size === 0 && keyboardKeys.size === 0);
  
  // 4. 統合されたキーセットを返す
  if (keyboardKeys.size > 0) {
    // キーボードが押されている場合はキーボードの入力を優先
    console.log("キーボードが押されている場合");
    return { pressedKeys: keyboardKeys, isTouchInput: false };
  } else {
    // キーボードが押されていない場合はタッチ入力を返す（タッチ操作がない場合は空のSetとisTouchInput: trueを返す）
    console.log("タッチ入力の場合");
    return { pressedKeys: touchKeys, isTouchInput: true };
  }
}