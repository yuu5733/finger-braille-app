// 1. コアライブラリ
import React from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import FingerButton from './FingerButton';

// 6. スタイルシート / アセット
import styles from './BrailleInput.module.css'; // 新しいパスとファイル名に変更

interface BrailleInputProps {
  pressedKeys: Set<string>; 
}

const BrailleInput: FC<BrailleInputProps> = ({ pressedKeys }) => {
  const leftHandClassName = `${styles.fingerGroup} ${styles.leftHand}`;
  const rightHandClassName = `${styles.fingerGroup} ${styles.rightHand}`;

  return (
    <div className={styles.brailleInputContainer}>
      {/* 左の指のボタン */}
      <div className={leftHandClassName}> 
        <FingerButton id="leftRing" isPressed={pressedKeys.has('s')} dot={3} />
        <FingerButton id="leftMiddle" isPressed={pressedKeys.has('d')} dot={2} />
        <FingerButton id="leftIndex" isPressed={pressedKeys.has('f')} dot={1} />
      </div>
      {/* 右の指のボタン */}
      <div className={rightHandClassName}>
        <FingerButton id="rightIndex" isPressed={pressedKeys.has('j')} dot={4} />
        <FingerButton id="rightMiddle" isPressed={pressedKeys.has('k')} dot={5} />
        <FingerButton id="rightRing" isPressed={pressedKeys.has('l')} dot={6} />
      </div>
    </div>
  );
};

export default BrailleInput;