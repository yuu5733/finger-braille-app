import React from 'react';
import type { FC } from 'react';
import type { InputMode } from '../../data/types'; 

import styles from './ModeDisplay.module.css';

interface ModeDisplayProps {
  currentMode: InputMode;
}

// モード名を表示用の日本語とCSSクラス、カラーコードに変換するヘルパー関数
const getModeConfig = (mode: InputMode) => {
  let label: string;
  let classNameKey: keyof typeof styles; 

  switch (mode) {
    case 'Kana':
      label = 'かな入力モード';
      classNameKey = 'kana'; // 灰色
      break;
    case 'Suuji':
      label = '数字モード';
      classNameKey = 'suuji'; // 青系統
      break;
    case 'Alphabet':
      label = '英字モード';
      classNameKey = 'alphabet'; // 緑系統
      break;
    case 'GaijiQuote':
      label = '外字引用符';
      classNameKey = 'alphabet'; // 英字モードと同様の色味を適用
      break;
    case 'Dakuon':
      label = '濁音 (ﾞ) 待機';
      classNameKey = 'wait'; // 黄色（待機モード共通）
      break;
    case 'Handakuon':
      label = '半濁音 (ﾟ) 待機';
      classNameKey = 'wait'; // 黄色（待機モード共通）
      break;
    case 'Youon':
      label = '拗音 (ゃゅょぃぇ) 待機';
      classNameKey = 'wait'; // 黄色（待機モード共通）
      break;
    case 'YouDakuon':
      label = '拗濁音 待機';
      classNameKey = 'wait'; // 黄色（待機モード共通）
      break;
    case 'YouHandakuon':
      label = '拗半濁音 待機';
      classNameKey = 'wait'; // 黄色（待機モード共通）
      break;
    case 'Question':
      label = '特殊音 (疑問符) 待機';
      classNameKey = 'wait';
      break;
    case 'Kuten':
      label = '特殊音 (句点) 待機';
      classNameKey = 'wait';
      break;
    case 'Tokushu456':
      label = '特殊音 ([4,5,6]点) 待機';
      classNameKey = 'wait';
      break;
    default:
      label = 'モード情報なし';
      classNameKey = 'kana'; // フォールバック
  }

  return { label, classNameKey };
};

const ModeDisplay: FC<ModeDisplayProps> = ({ currentMode }) => {
  const { label, classNameKey } = getModeConfig(currentMode);
  
  const modeClassName = `${styles.modeDisplay} ${styles[classNameKey]}`;

  return (
    <div className={styles.modeDisplayWrapper}>
      <div className={modeClassName}>
        {label}
      </div>
    </div>
  );
};

export default ModeDisplay;