// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import styles from './FingerButton.module.css';

interface FingerButtonProps {
  id: string;           // ボタンの識別子（例: 'leftIndex'）
  isPressed: boolean;   // ボタンが押されているかどうか
  dot?: number;         // 点字の点番号（任意）
  shortcutKey?: string; // キーボードショートカット（任意）
  label?: string;       // 表示用ラベル（任意）
  className?: string;   // 追加のCSSクラス（任意）
}

const FingerButton: FC<FingerButtonProps> = ({
  id,
  isPressed,
  dot,
  shortcutKey,
  label,
  className,
}) => {
  const buttonClassName = `${styles.fingerButton} ${isPressed ? styles.pressed : ''} ${className || ''}`;

  // 読み上げ用のラベルを決定（必要に応じて調整）
  const displayContent = label !== undefined ? label : dot;

  return (
    <button
      id={id}
      type="button"
      className={buttonClassName}
      aria-pressed={isPressed}
    >
      <div className={styles.contentWrapper}>
        <span className={styles.dotLabel}>{displayContent}</span>
        {shortcutKey && (
          <span className={styles.shortcutKey}>
            {shortcutKey}
          </span>
        )}
      </div>
    </button>
  );
};

export default FingerButton;