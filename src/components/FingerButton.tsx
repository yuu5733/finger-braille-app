import React from 'react';
import '../styles/fingerButton.css';

interface FingerButtonProps {
  id: string; // ボタンの識別子（例: 'leftIndex'）
  isPressed: boolean; // ボタンが押されているかどうか
  dot: number; // 点字の点番号（1から6まで）
}

const FingerButton: React.FC<FingerButtonProps> = ({ id, isPressed, dot }) => {
  return (
    <button
      id={id}
      type="button"
      className={`finger-button ${isPressed ? 'pressed' : ''}`}
      aria-pressed={isPressed}
    >
      <div className="dot-label">{dot}</div>
    </button>
  );
};
export default FingerButton;