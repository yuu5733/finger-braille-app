import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { BrailleDot } from '../../data/types';
import styles from './FingerButton.module.css';

interface FingerButtonProps {
  id: string;
  isPressed: boolean;
  dot?: BrailleDot;
  shortcutKey?: string;
  label?: string;
  className?: string;
  onPress?: () => void;
  onRelease?: () => void;
}

const FingerButton: FC<FingerButtonProps> = ({
  id,
  isPressed,
  dot,
  shortcutKey,
  label,
  className,
  onPress,
  onRelease,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleTouchStart = (e: TouchEvent) => {
      console.log(`[DOM Event] touchstart on ${id}`);
      onPress?.();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      console.log(`[DOM Event] touchend on ${id}`);
      onRelease?.();
    };

    const handleMouseDown = () => {
      console.log(`[DOM Event] mousedown on ${id}`);
      onPress?.();
    };

    const handleMouseUp = () => {
      console.log(`[DOM Event] mouseup on ${id}`);
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

  const isSpace = id === 'spaceButton';
  const sizeStyle = isSpace ? styles.spaceButton : '';
  const pressedStyle = isPressed
    ? isSpace
      ? styles.spacePressed
      : styles.pressed
    : '';

  const buttonClassName = `${styles.fingerButton} ${sizeStyle} ${pressedStyle} ${className || ''}`;

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
      ref={buttonRef}
      id={id}
      type="button"
      className={buttonClassName}
      aria-pressed={isPressed}
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
