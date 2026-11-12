import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { BrailleDot } from '../../data/types';
import styles from './FingerButton.module.css';

interface FingerButtonProps {
  id: string;
  isPressed: boolean;
  dot: BrailleDot;
  shortcutKey?: string;
  className?: string;
  onPress?: () => void;
  onRelease?: () => void;
}

const FingerButton: FC<FingerButtonProps> = ({
  id,
  isPressed,
  dot,
  shortcutKey,
  className,
  onPress,
  onRelease,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleTouchStart = () => {
      onPress?.();
    };

    const handleTouchEnd = () => {
      onRelease?.();
    };

    const handleMouseDown = () => {
      onPress?.();
    };

    const handleMouseUp = () => {
      onRelease?.();
    };

    btn.addEventListener('touchstart', handleTouchStart, { passive: true });
    btn.addEventListener('touchend', handleTouchEnd);
    btn.addEventListener('touchcancel', handleTouchEnd);
    btn.addEventListener('mousedown', handleMouseDown);
    btn.addEventListener('mouseup', handleMouseUp);

    return () => {
      btn.removeEventListener('touchstart', handleTouchStart);
      btn.removeEventListener('touchend', handleTouchEnd);
      btn.removeEventListener('touchcancel', handleTouchEnd);
      btn.removeEventListener('mousedown', handleMouseDown);
      btn.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, onPress, onRelease]);

  const buttonClassName = `${styles.fingerButton} ${
    isPressed ? styles.pressed : ''
  } ${className || ''}`;

  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      className={buttonClassName}
      aria-pressed={isPressed}
    >
      <div className={styles.dotLabel}>
        {dot}
        <span className="sr-only">の点</span>
      </div>
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
