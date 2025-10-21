// 1. コアライブラリ
import React, { useCallback } from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleDot } from '../../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import styles from './FingerButton.module.css';

// 外部から渡すコールバックの型を定義
interface FingerButtonProps {
  id: string;         // ボタンの識別子（例: 'leftIndex'）
  keyMapping: string; // 対応するキーボードのキー ('f', 'd', 's', 'j', 'k', 'l')
  isPressed: boolean; // ボタンが押されているかどうか
  dot: number;        // 点字の点番号（1から6まで）
  // 押下状態の変更を通知するコールバック
  onPressChange: (key: string, isPressed: boolean) => void;
}

const FingerButton: FC<FingerButtonProps> = ({ id, keyMapping, isPressed, dot, onPressChange }) => {
  const className = `${styles.fingerButton} ${isPressed ? styles.pressed : ''}`;

  // 押された時のイベントハンドラ (タッチ・マウス共通)
  const handlePress = useCallback(() => {
    // 押下状態を true で通知
    onPressChange(keyMapping, true);
  }, [keyMapping, onPressChange]);
  
  // 離された時のイベントハンドラ (タッチ・マウス共通)
  const handleRelease = useCallback(() => {
    // 押下状態を false で通知
    onPressChange(keyMapping, false);
  }, [keyMapping, onPressChange]);

  return (
    <button
      id={id}
      type="button"
      className={className} 
      aria-pressed={isPressed}

      // 💡 タッチ操作に対応 (スマートフォン)
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      // 💡 マウス操作に対応 (PCでのクリック)
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      // onMouseLeave={isPressed ? handleRelease : undefined} // 押したままボタン外で離した場合の対策
    >
      <div className={styles.dotLabel}>{dot}</div>
    </button>
  );
};
export default FingerButton;