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

  const createTouchHandlers = (key: string) => ({
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => {
      console.log(`[MobileInput] TouchStart: key=${key}`);
      onKeyPress(key);
    },
    onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => {
      console.log(`[MobileInput] TouchEnd: key=${key}`);
      onKeyRelease(key);
    },
    onTouchCancel: (e: React.TouchEvent<HTMLButtonElement>) => {
      console.log(`[MobileInput] TouchCancel: key=${key}`);
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
              {...createTouchHandlers('s')}
            />
            <FingerButton
              id="leftMiddle"
              isPressed={pressedKeys.has('d')}
              dot={2}
              {...createTouchHandlers('d')}
            />
            <FingerButton
              id="leftIndex"
              isPressed={pressedKeys.has('f')}
              dot={1}
              {...createTouchHandlers('f')}
            />
          </div>
          {/* 右の指のボタン */}
          <div className={rightHandClassName}>
            <FingerButton
              id="rightIndex"
              isPressed={pressedKeys.has('j')}
              dot={4}
              {...createTouchHandlers('j')}
            />
            <FingerButton
              id="rightMiddle"
              isPressed={pressedKeys.has('k')}
              dot={5}
              {...createTouchHandlers('k')}
            />
            <FingerButton
              id="rightRing"
              isPressed={pressedKeys.has('l')}
              dot={6}
              {...createTouchHandlers('l')}
            />
          </div>
        </div>

        {/* スペースボタン */}
        <div className={styles.spaceButtonWrapper}>
          <FingerButton
            id="spaceButton"
            isPressed={pressedKeys.has(' ')}
            label="スペース"
            {...createTouchHandlers(' ')}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileBrailleInput;
