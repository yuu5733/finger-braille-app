// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { InputMode } from '../../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import { inputModeLabels } from '../../data/table';

// 6. スタイルシート / アセット
import styles from './ModeDisplay.module.css';

interface ModeDisplayProps {
  currentMode: InputMode;
}

// モード名を表示用の日本語とCSSクラス、カラーコードに変換するヘルパー関数
const getModeConfig = (mode: InputMode) => {
  let classNameKey: keyof typeof styles;

  switch (mode) {
    case 'Kana':
      classNameKey = 'kana'; // 灰色
      break;
    case 'Suuji':
      classNameKey = 'suuji'; // 青系統
      break;
    case 'Alphabet':
    case 'GaijiQuote':
      classNameKey = 'alphabet'; // 緑系統（英字モードと外字引用モードで共通）
      break;
    case 'Dakuon':
    case 'Handakuon':
    case 'Youon':
    case 'YouDakuon':
    case 'YouHandakuon':
    case 'Question':
    case 'Kuten':
    case 'Tokushu456':
      classNameKey = 'wait'; // 黄色（待機モード共通）
      break;
    default:
      classNameKey = 'kana'; // フォールバック
  }

  // ラベル名は、table.ts から共通のラベルを使用。存在しない場合はフォールバック
  const label = inputModeLabels[mode] || 'モード情報なし';

  return { label, classNameKey };
};

const ModeDisplay: FC<ModeDisplayProps> = ({ currentMode }) => {
  const { label, classNameKey } = getModeConfig(currentMode);

  const modeClassName = `${styles.modeDisplay} ${styles[classNameKey]}`;

  return (
    <div className={styles.modeDisplayWrapper}>
      <div className={modeClassName}>{label}</div>
    </div>
  );
};

export default ModeDisplay;
