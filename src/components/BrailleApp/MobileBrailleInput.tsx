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
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      onKeyPress(key);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      onKeyRelease(key);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      e.preventDefault();
      onKeyRelease(key);
    },
    onPointerCancel: (e: React.PointerEvent) => {
      e.preventDefault();
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
          {/* 左の指のボタン (点3: s, 点2: d, 点1: f) */}
          <div className={leftHandClassName}>
            <div
              {...createPointerHandlers('s')}
              style={{ display: 'inline-block' }}
            >
              <FingerButton
                id="leftRing"
                isPressed={pressedKeys.has('s')}
                dot={3}
              />
            </div>
            <div
              {...createPointerHandlers('d')}
              style={{ display: 'inline-block' }}
            >
              <FingerButton
                id="leftMiddle"
                isPressed={pressedKeys.has('d')}
                dot={2}
              />
            </div>
            <div
              {...createPointerHandlers('f')}
              style={{ display: 'inline-block' }}
            >
              <FingerButton
                id="leftIndex"
                isPressed={pressedKeys.has('f')}
                dot={1}
              />
            </div>
          </div>
          {/* 右の指のボタン (点4: j, 点5: k, 点6: l) */}
          <div className={rightHandClassName}>
            <div
              {...createPointerHandlers('j')}
              style={{ display: 'inline-block' }}
            >
              <FingerButton
                id="rightIndex"
                isPressed={pressedKeys.has('j')}
                dot={4}
              />
            </div>
            <div
              {...createPointerHandlers('k')}
              style={{ display: 'inline-block' }}
            >
              <FingerButton
                id="rightMiddle"
                isPressed={pressedKeys.has('k')}
                dot={5}
              />
            </div>
            <div
              {...createPointerHandlers('l')}
              style={{ display: 'inline-block' }}
            >
              <FingerButton
                id="rightRing"
                isPressed={pressedKeys.has('l')}
                dot={6}
              />
            </div>
          </div>
        </div>

        {/* スペースボタン */}
        <div className={styles.spaceButtonWrapper}>
          <div {...createPointerHandlers(' ')} style={{ width: '100%' }}>
            <FingerButton
              id="spaceButton"
              isPressed={pressedKeys.has(' ')}
              label="スペース"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBrailleInput;
