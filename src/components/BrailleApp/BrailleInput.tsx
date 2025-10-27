// 1. コアライブラリ
import React from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import { useBrailleContext } from '../../contexts/BrailleContext';
import FingerButton from './FingerButton';

// 6. スタイルシート / アセット
import styles from './BrailleInput.module.css'; // 新しいパスとファイル名に変更

interface BrailleInputProps {
  pressedKeys: Set<string>; 
}

const BrailleInput: FC<BrailleInputProps> = ({ pressedKeys }) => {
  const leftHandClassName = `${styles.fingerGroup} ${styles.leftHand}`;
  const rightHandClassName = `${styles.fingerGroup} ${styles.rightHand}`;

// useBrailleContext から handlePressChange を取得
  const { handlePressChange } = useBrailleContext();

  return (
    <div className={styles.brailleInputContainer}>
      {/* 左の指のボタン */}
      <div className={leftHandClassName}> 
        <FingerButton 
          id="leftRing" 
          keyMapping='s'
          isPressed={pressedKeys.has('s')} 
          dot={3} 
          onPressChange={handlePressChange}
        />
        <FingerButton 
          id="leftMiddle" 
          keyMapping='d'
          isPressed={pressedKeys.has('d')} 
          dot={2} 
          onPressChange={handlePressChange}
        />
        <FingerButton 
          id="leftIndex" 
          keyMapping='f'
          isPressed={pressedKeys.has('f')} 
          dot={1} 
          onPressChange={handlePressChange}
        />
      </div>
      {/* 右の指のボタン */}
      <div className={rightHandClassName}>
        <FingerButton 
          id="rightIndex" 
          keyMapping='j'
          isPressed={pressedKeys.has('j')} 
          dot={4} 
          onPressChange={handlePressChange}
        />
        <FingerButton 
          id="rightMiddle" 
          keyMapping='k'
          isPressed={pressedKeys.has('k')} 
          dot={5} 
          onPressChange={handlePressChange}
        />
        <FingerButton 
          id="rightRing" 
          keyMapping='l'
          isPressed={pressedKeys.has('l')} 
          dot={6} 
          onPressChange={handlePressChange}
        />
      </div>
    </div>
  );
};

export default BrailleInput;