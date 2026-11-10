// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleDot } from '../../data/types'

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import styles from './FingerButton.module.css';

interface FingerButtonProps {
  id: string; // ボタンの識別子（例: 'leftIndex'）
  isPressed: boolean; // ボタンが押されているかどうか
  dot?: BrailleDot; // 点字の点番号（任意）
  shortcutKey?: string; // キーボードショートカット（任意）
  label?: string; // 表示用ラベル（任意）
  className?: string; // 追加のCSSクラス（任意）
  onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel?: (e: React.PointerEvent<HTMLButtonElement>) => void;
}

const FingerButton: FC<FingerButtonProps> = ({
  id,
  isPressed,
  dot,
  shortcutKey,
  label,
  className,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
}) => {
  const isSpace = id === 'spaceButton';

  // すべてのボタンに共通のベーススタイル（fingerButton）を当て、
  // スペースの時だけサイズ等を上書きする .spaceButton を追加で当てます
  const sizeStyle = isSpace ? styles.spaceButton : '';

  // 押された時のスタイル
  const pressedStyle = isPressed
    ? isSpace
      ? styles.spacePressed
      : styles.pressed
    : '';

  const buttonClassName = `${styles.fingerButton} ${sizeStyle} ${pressedStyle} ${className || ''}`;

  // 読み上げ用のラベルを決定
  const displayContent =
    label !== undefined ? (
      label
    ) : (
      <>
        {dot}
        <span className="sr-only">の点</span>
      </>
    );

  return (
    <button
      id={id}
      type="button"
      className={buttonClassName}
      aria-pressed={isPressed}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
    >
      <div className={styles.dotLabel}>{displayContent}</div>
      {shortcutKey && (
        <div className={styles.shortcutKey}>
          {shortcutKey}
          <span className="sr-only">キー</span>
        </div>
      )}
    </button>
  );
};

export default FingerButton;
