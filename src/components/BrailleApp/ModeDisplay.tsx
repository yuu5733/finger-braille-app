import React from 'react';
import type { FC } from 'react';
import type { InputMode } from '../../data/types'; 
import '../../styles/modeDisplay.css'; // スタイルをインポート

interface ModeDisplayProps {
  currentMode: InputMode;
}

// モード名を表示用の日本語とCSSクラス、カラーコードに変換するヘルパー関数
const getModeConfig = (mode: InputMode) => {
  let label: string;
  let className: string;

  switch (mode) {
    case 'Kana':
      label = 'かな入力モード';
      className = 'kana'; // 灰色
      break;
    case 'Suuji':
      label = '数字モード';
      className = 'suuji'; // 青系統
      break;
    case 'Alphabet':
      label = '英字モード';
      className = 'alphabet'; // 緑系統
      break;
    case 'Dakuon':
      label = '濁音 (ﾞ) 待機';
      className = 'wait'; // 黄色（待機モード共通）
      break;
    case 'Handakuon':
      label = '半濁音 (ﾟ) 待機';
      className = 'wait'; // 黄色（待機モード共通）
      break;
    case 'Youon':
      label = '拗音 (ゃゅょ) 待機';
      className = 'wait'; // 黄色（待機モード共通）
      break;
    case 'YouDakuon':
      label = '拗濁音 待機';
      className = 'wait'; // 黄色（待機モード共通）
      break;
    case 'YouHandakuon':
      label = '拗半濁音 待機';
      className = 'wait'; // 黄色（待機モード共通）
      break;
    case 'GouYouon':
      label = '合拗音 待機';
      className = 'wait'; // 黄色（待機モード共通）
      break;
    default:
      label = '不明なモード';
      className = 'kana';
  }

  return { label, className };
};

const ModeDisplay: FC<ModeDisplayProps> = ({ currentMode }) => {
  const { label, className } = getModeConfig(currentMode);

  return (
    <div className="mode-display-wrapper">
      <div className={`mode-display mode-display--${className}`}>
        {label}
      </div>
    </div>
  );
};

export default ModeDisplay;