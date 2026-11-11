// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { InputMode } from '../../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import { inputModeConfigs } from '../../data/table';

// 6. スタイルシート / アセット
import styles from './ModeDisplay.module.css';

interface ModeDisplayProps {
  currentMode: InputMode;
  className?: string;
}

const ModeDisplay: FC<ModeDisplayProps> = ({ currentMode, className }) => {
  // table.ts からモード設定を取得（存在しない場合は、kanaにフォールバック）
  const config = inputModeConfigs[currentMode] || {
    label: 'モード情報なし',
    classNameKey: 'kana',
  };

  const modeClassName = `${styles.modeDisplay} ${styles[config.classNameKey]}`;

  return (
    <div className={`${styles.modeDisplayWrapper} ${className || ''}`}>
      <div className={modeClassName}>{config.label}</div>
    </div>
  );
};

export default ModeDisplay;
