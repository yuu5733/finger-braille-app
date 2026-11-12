// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import FingerButton from './FingerButton';
import SpaceButton from './SpaceButton';

// 6. スタイルシート / アセット
import styles from './BrailleInput.module.css';

interface BrailleInputProps {
  // 重複のない文字列のコレクション
  pressedKeys: Set<string>;
}

const BrailleInput: FC<BrailleInputProps> = ({ pressedKeys }) => {
  const leftHandClassName = `${styles.fingerGroup} ${styles.leftHand}`;
  const rightHandClassName = `${styles.fingerGroup} ${styles.rightHand}`;

  return (
    <div className={styles.brailleInputContainer}>
      {/* 6つのボタンとスペースボタンをまとめるwrapperのdiv */}
      <div className={styles.inputWrapper}>
        <div className={styles.buttonsGrid}>
          {/* 左の指のボタン */}
          <div className={leftHandClassName}>
            <FingerButton
              id="leftRing"
              isPressed={pressedKeys.has('s')}
              shortcutKey="S"
              dot={3}
            />
            <FingerButton
              id="leftMiddle"
              isPressed={pressedKeys.has('d')}
              shortcutKey="D"
              dot={2}
            />
            <FingerButton
              id="leftIndex"
              isPressed={pressedKeys.has('f')}
              shortcutKey="F"
              dot={1}
            />
          </div>
          {/* 右の指のボタン */}
          <div className={rightHandClassName}>
            <FingerButton
              id="rightIndex"
              isPressed={pressedKeys.has('j')}
              shortcutKey="J"
              dot={4}
            />
            <FingerButton
              id="rightMiddle"
              isPressed={pressedKeys.has('k')}
              shortcutKey="K"
              dot={5}
            />
            <FingerButton
              id="rightRing"
              isPressed={pressedKeys.has('l')}
              shortcutKey="L"
              dot={6}
            />
          </div>
        </div>

        <div className={styles.spaceButtonWrapper}>
          <SpaceButton isPressed={pressedKeys.has(' ')} maxWidth="350px" />
        </div>
      </div>
    </div>
  );
};

export default BrailleInput;
