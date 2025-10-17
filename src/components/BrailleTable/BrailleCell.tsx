import React from 'react';

import type { FC } from 'react';
import type { BrailleDot } from '../../data/types'; 

import FingerBrailleSVG from './FingerBrailleSVG'; // SVGコンポーネントをインポート

// CSSモジュールをインポート
import styles from './BrailleCell.module.css';

interface BrailleCellProps {
  /** 表示する文字（ひらがな、記号など） */
  character: string;
  /** 点字の点番号（1〜6）の配列 */
  dots: BrailleDot[];
  /** 対応する点字の Unicode 文字（例: '⠁'） */
  brailleChar: string;
}

const BrailleCell: FC<BrailleCellProps> = ({ character, dots, brailleChar }) => {
  // 点番号をカンマ区切りで表示 (例: [1, 2, 3])
  const dotNumbersText = dots.length > 0 ? dots.join(', ') : 'なし';

  return (
    // liにモジュールクラスを適用
    <li className={styles.cellContainer}>
      {/* グリッドコンテナ */}
      <div className={styles.contentWrapper}>
        
        {/* 1. 指点字の視覚表示（左半分） */}
        <div className={styles.fingerBraille}>
          <FingerBrailleSVG brailleDots={dots} /> 
        </div>

        {/* 2. 文字情報（右側） */}
        <p className={styles.dotNumbers}>[{dotNumbersText}]</p>
        <p className={styles.character}>{character}</p>
        <p className={styles.brailleCharContainer}><span>{brailleChar}</span></p>
      </div>
    </li>
  );
};

export default BrailleCell;