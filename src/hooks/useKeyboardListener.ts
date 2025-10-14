import { useState, useEffect } from 'react';

// 指点字キーの定義
const monitoredKeys: { [key: string]: boolean } = {
  'f': true, 'd': true, 's': true,
  'j': true, 'k': true, 'l': true,
};

/**
 * キーボードの押下状態を監視し、現在押されているキーのSetを管理するカスタムフック
 * @returns pressedKeys: 現在押されているキーのSet
 */
export function useKeyboardListener() {
  // 初期値として、空の Set オブジェクト（String型）を設定。String型の配列にするより便利
  // 重複を許容しないのと、要素の存在チェック (.has()) や削除 (.delete()) が簡単にできるため
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

    // 指点字として設定しているキーが押されたとき
    // 同じキーを繰り返し押す場合に何度も登録されないように、すでに押されているキーは無視
      if (monitoredKeys[key] && !pressedKeys.has(key)) {
        // 新しいSetインスタンスを作成してStateを更新
        setPressedKeys(prev => new Set(prev).add(key));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

    // 押されたキーが、指点字のキーマップ（f, d, s, j, k, l）の中に存在する場合
    // （アルファベットに対応する数字があるかどうか）
      if (monitoredKeys[key]) {
        // StateのSetから離されたキーを削除（数字ではなく、キーボードの文字で管理）
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      // クリーンアップ関数でイベントリスナーを削除（アンマウント時）
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return pressedKeys;
}