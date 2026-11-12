import type { FC } from 'react';
import FingerButton from './FingerButton';
import SpaceButton from './SpaceButton';
import styles from './MobileBrailleInput.module.css';

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

  return (
    <div
      className={styles.brailleInputContainer}
      style={{ touchAction: 'manipulation' }}
    >
      <div className={styles.inputWrapper}>
        <div className={styles.buttonsGrid}>
          {/* 左の指のボタン */}
          <div className={leftHandClassName}>
            <FingerButton
              id="leftRing"
              isPressed={pressedKeys.has('s')}
              dot={3}
              onPress={() => onKeyPress('s')}
              onRelease={() => onKeyRelease('s')}
            />
            <FingerButton
              id="leftMiddle"
              isPressed={pressedKeys.has('d')}
              dot={2}
              onPress={() => onKeyPress('d')}
              onRelease={() => onKeyRelease('d')}
            />
            <FingerButton
              id="leftIndex"
              isPressed={pressedKeys.has('f')}
              dot={1}
              onPress={() => onKeyPress('f')}
              onRelease={() => onKeyRelease('f')}
            />
          </div>
          {/* 右の指のボタン */}
          <div className={rightHandClassName}>
            <FingerButton
              id="rightIndex"
              isPressed={pressedKeys.has('j')}
              dot={4}
              onPress={() => onKeyPress('j')}
              onRelease={() => onKeyRelease('j')}
            />
            <FingerButton
              id="rightMiddle"
              isPressed={pressedKeys.has('k')}
              dot={5}
              onPress={() => onKeyPress('k')}
              onRelease={() => onKeyRelease('k')}
            />
            <FingerButton
              id="rightRing"
              isPressed={pressedKeys.has('l')}
              dot={6}
              onPress={() => onKeyPress('l')}
              onRelease={() => onKeyRelease('l')}
            />
          </div>
        </div>

        {/* スペースボタン */}
        <div className={styles.spaceButtonWrapper}>
          <SpaceButton
            isPressed={pressedKeys.has(' ')}
            maxWidth="160px"
            className={styles.mobileSpaceButton}
            onPress={() => onKeyPress(' ')}
            onRelease={() => onKeyRelease(' ')}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileBrailleInput;
