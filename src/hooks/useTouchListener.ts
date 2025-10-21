import { useState, useCallback } from 'react';

/**
 * FingerButtonからのタッチ・クリックイベントを受け付け、押下状態を管理するカスタムフック
 * @returns pressedKeys: 現在押されているキーのSet, handlePressChange: ボタンの押下状態を更新するコールバック
 */
export function useTouchListener() {
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());
  
  // ボタンからの押下状態変更を受け付けるコールバック
  const handlePressChange = useCallback((key: string, isPressed: boolean) => {
    setPressedKeys(prevKeys => {
      const newKeys = new Set(prevKeys);
      if (isPressed) {
        newKeys.add(key);
      } else {
        newKeys.delete(key);
      }
      // Setが変更された場合にのみ新しいインスタンスを返す（ReactのState更新のベストプラクティス）
      if (newKeys.size !== prevKeys.size || isPressed !== prevKeys.has(key)) {
        return newKeys;
      }
      return prevKeys;
    });
  }, []);

  return { pressedKeys, handlePressChange };
}