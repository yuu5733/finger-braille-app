import type { FC } from 'react';
import FingerButton from './FingerButton';
import styles from './BrailleInput.module.css';

interface MobileBrailleInputProps {
  pressedKeys: Set<string>;
  onKeyPress: (key: string) => void;
  onKeyRelease: (key: string) => void;
}

export const MobileBrailleInput: FC<MobileBrailleInputProps> = ({
  pressedKeys,
  onKeyPress,
  onKeyRelease,
}) => {
  const leftHandClassName = `${styles.fingerGroup} ${styles.leftHand}`;
  const rightHandClassName = `${styles.fingerGroup} ${styles.rightHand}`;

  const createPointerHandlers = (key: string) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      onKeyPress(key);
    },
    onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
      onKeyRelease(key);
    },
    onPointerLeave: (e: React.PointerEvent<HTMLButtonElement>) => {
      onKeyRelease(key);
    },
    onPointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => {
      onKeyRelease(key);
    },
  });

  return (
    <div
      className={styles.brailleInputContainer}
      style={{ touchAction: 'none' }}
    >
      <div className={styles.inputWrapper}>
        <div className={styles.buttonsGrid}>
          {/* 左の指のボタン */}
          <div className={leftHandClassName}>
            <FingerButton
              id="leftRing"
              isPressed={pressedKeys.has('s')}
              dot={3}
              {...createPointerHandlers('s')}
            />
            <FingerButton
              id="leftMiddle"
              isPressed={pressedKeys.has('d')}
              dot={2}
              {...createPointerHandlers('d')}
            />
            <FingerButton
              id="leftIndex"
              isPressed={pressedKeys.has('f')}
              dot={1}
              {...createPointerHandlers('f')}
            />
          </div>
          {/* 右の指のボタン */}
          <div className={rightHandClassName}>
            <FingerButton
              id="rightIndex"
              isPressed={pressedKeys.has('j')}
              dot={4}
              {...createPointerHandlers('j')}
            />
            <FingerButton
              id="rightMiddle"
              isPressed={pressedKeys.has('k')}
              dot={5}
              {...createPointerHandlers('k')}
            />
            <FingerButton
              id="rightRing"
              isPressed={pressedKeys.has('l')}
              dot={6}
              {...createPointerHandlers('l')}
            />
          </div>
        </div>

        {/* スペースボタン */}
        <div className={styles.spaceButtonWrapper}>
          <FingerButton
            id="spaceButton"
            isPressed={pressedKeys.has(' ')}
            label="スペース"
            {...createPointerHandlers(' ')}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileBrailleInput;
