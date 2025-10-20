import React from 'react';

import type { BrailleDot } from '../../data/types';

import styles from './FingerButton.module.css';

interface FingerButtonProps {
  id: string; // ボタンの識別子（例: 'leftIndex'）
  isPressed: boolean; // ボタンが押されているかどうか
  dot: BrailleDot; // 点字の点番号（1から6まで）
}

const FingerButton: React.FC<FingerButtonProps> = ({ id, isPressed, dot }) => {
  const className = `${styles.fingerButton} ${isPressed ? styles.pressed : ''}`;

  return (
    <button
      id={id}
      type="button"
      className={className} 
      aria-pressed={isPressed}
    >
      <div className={styles.dotLabel}>{dot}</div>
    </button>
  );
};
export default FingerButton;