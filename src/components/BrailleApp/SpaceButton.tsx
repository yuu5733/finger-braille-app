import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import styles from './SpaceButton.module.css';

interface SpaceButtonProps {
  isPressed: boolean;
  label?: string;
  className?: string;
  maxWidth?: string;
  onPress?: () => void;
  onRelease?: () => void;
}

const SpaceButton: FC<SpaceButtonProps> = ({
  isPressed,
  label = 'スペース',
  className,
  maxWidth,
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
  }, [onPress, onRelease]);

  const buttonClassName = `${styles.spaceButton} ${
    isPressed ? styles.spacePressed : ''
  } ${className || ''}`;

  return (
    <button
      ref={buttonRef}
      id="spaceButton"
      type="button"
      className={buttonClassName}
      style={maxWidth ? { maxWidth } : undefined}
      aria-pressed={isPressed}
    >
      <div className={styles.dotLabel}>{label}</div>
    </button>
  );
};

export default SpaceButton;
