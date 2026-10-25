import React from 'react';

import type { FC } from 'react';
import type { BrailleDot, SubCellData, BrailleData } from '../../data/types'; 

import FingerBrailleSVG from './FingerBrailleSVG'; // SVGコンポーネントをインポート

// CSSモジュールをインポート
import styles from './BrailleCell.module.css';


interface BrailleCellProps extends BrailleData {
  /** 文字の長さの関係で、classを追加する必要があるか */
  flag?: boolean;
  /** 文字の種類 */
  type?: 'hiragana' | 'alphabet' | 'number';
}

const BrailleCell: FC<BrailleCellProps> = ({ 
  character, 
  dots, 
  braille, 
  subCells, 
  columnSpan = 1, 
  comment, 
  flag, 
  type }) => {
  const characterClassName = flag ? `${styles.character} ${styles.longCharacter}` : styles.character;

  // subCellsがあるかどうかでラッパーのクラスを切り替える
  const wrapperClassName = subCells 
    ? `${styles.contentWrapper} ${styles.multiContentWrapper}` 
    : styles.contentWrapper;

  return (
    <li className={styles.cellContainer} data-span={columnSpan}>
      <div className={wrapperClassName}>
        {/* 文字を上に配置 */}
        <p className={characterClassName}>{character}</p>

        {subCells ? (
          <>
            {/* 1行目・右側：点字文字のグループをまとめる */}
            <div className={styles.multiBrailleCharContainer}>
              {subCells.map((sub, index) => (
                <span key={index}>{sub.braille}</span>
              ))}
            </div>

            {/* 2行目全体：点番号のグループをまとめる */}
            <div className={styles.multiDotNumbers}>
              {subCells.map((sub, index) => (
                <span key={index}>[{sub.dots.join(', ')}]</span>
              ))}
            </div>

            {/* 3行目全体：指点字SVGのグループをまとめる */}
            <div className={styles.multiFingerBraille}>
              {subCells.map((sub, index) => (
                <div key={index} className={styles.subSvgItem}>
                  <FingerBrailleSVG brailleDots={sub.dots} type={type} />
                </div>
              ))}
            </div>
          </>
        ) : (
          /* 従来の単一セル形式 */
          <>
            <div className={styles.fingerBraille}>
              <FingerBrailleSVG brailleDots={dots || []} type={type} />
            </div>
            <p className={styles.dotNumbers}>[{dots ? dots.join(', ') : 'なし'}]</p>
            <p className={styles.brailleCharContainer}><span>{braille}</span></p>
          </>
        )}

        {/* コメント */}
        {comment && <p className={styles.comment}>{comment}</p>}
      </div>
    </li>
  );
};

export default BrailleCell;