// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleData, BrailleColorType } from '../../data/types'; 

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import FingerBrailleSVG from './FingerBrailleSVG'; // SVGコンポーネントをインポート

// 6. スタイルシート / アセット
import styles from './BrailleCell.module.css';


interface BrailleCellProps extends BrailleData {
  /** 文字の長さの関係で、classを追加する必要があるか */
  flag?: boolean;
}

const BrailleCell: FC<BrailleCellProps> = ({ 
  character, 
  dots, 
  braille, 
  subCells, 
  columnSpan = 1, 
  comment, 
  flag, 
  colorType }) => {
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
                  {/* sub側で個別指定があれば優先、なければセルのcolorType */}
                  <FingerBrailleSVG 
                    brailleDots={sub.dots} 
                    colorType={sub.colorType || colorType} 
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          /* 従来の単一セル形式 */
          <>
            <div className={styles.fingerBraille}>
              <FingerBrailleSVG brailleDots={dots || []} colorType={colorType} />
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