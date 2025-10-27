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
      // 1. 変更の必要性を確認 (これが最も重要)
      const shouldAdd = isPressed && !prevKeys.has(key);
      const shouldDelete = !isPressed && prevKeys.has(key);

      // 2. 変更が不要であれば、そのまま古いSetを返す
      if (!shouldAdd && !shouldDelete) {
        return prevKeys;
      }
      
      // 3. 変更が必要であれば、新しいSetを作成し、操作を行う
      const newKeys = new Set(prevKeys);
      if (shouldAdd) {
        newKeys.add(key);
      } else if (shouldDelete) {
        newKeys.delete(key);
      }
      
      // 💡 確実に新しいSetを返す（この時点で変更は保証されている）
      return newKeys; 
    });
  }, []);

  return { pressedKeys, handlePressChange };
}