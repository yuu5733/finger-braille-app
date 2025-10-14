import { useEffect, useState } from 'react';

/**
 * キー押下状態のデバウンスを行い、安定した入力とキー解放状態を提供するカスタムフック
 * @param pressedKeys useKeyboardListener からの生のキー入力
 * @returns { stabilizedKeys: Set<string> | null, isKeysReleased: boolean } 
 * stabilizedKeys: 100ms安定した入力（タイマー内で処理されるキー）
 */
export function useBrailleInputTiming(pressedKeys: Set<string>) {
  // タイマー発火時に安定したキーの状態を保持
  const [stabilizedKeys, setStabilizedKeys] = useState<Set<string> | null>(null);
  const isKeysReleased = pressedKeys.size === 0;

  useEffect(() => {
    // キーが全て離された場合、即座にタイマーをキャンセルし、StabilizedKeysをリセット
    if (isKeysReleased) {
      setStabilizedKeys(null); // キー解放時は安定入力なし
      return;
    }

    // 100ms後に実行するタイマーを設定（デバウンス）
    const timer = setTimeout(() => {
      // 100ms経過後、現在のpressedKeysを安定した入力としてセット
      setStabilizedKeys(new Set(pressedKeys));
    }, 100); 

    // クリーンアップ関数: pressedKeysが変化するたびにタイマーをキャンセル
    return () => {
      clearTimeout(timer);
    };
  }, [pressedKeys, isKeysReleased]);

  return { stabilizedKeys, isKeysReleased };
}