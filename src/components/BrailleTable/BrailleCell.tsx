// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleData, BrailleColorType, SubCellData } from '../../data/types'; 

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import { KIGOU_CHAR_SET } from './../../data/table.ts';
import FingerBrailleSVG from './FingerBrailleSVG'; // SVGコンポーネントをインポート

// 6. スタイルシート / アセット
import styles from './BrailleCell.module.css';


interface BrailleCellProps extends BrailleData {
  /** 文字の長さの関係で、classを追加する必要があるか */
  flag?: boolean;
}

/**
 * サブセルの最適な colorType を判定する関数
 */
const getSubCellColorType = (
  sub: SubCellData,
  parentColorType?: BrailleColorType
): BrailleColorType => {
  // 1. サブセルに直接指定があれば最優先
  if (sub.colorType) return sub.colorType;

  // 2. 文字名が濁音符や符号系であれば "kigou" に設定
  if (KIGOU_CHAR_SET.has(sub.character)) {
    return 'kigou';
  }

  // 3. それ以外は親（セル/行）の colorType を継承
  return parentColorType || 'hiragana';
};

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
            {/* 1行目・右側：点字文字のグループ */}
            <div className={styles.multiBrailleCharContainer}>
              {subCells.map((sub, index) => (
                <span key={index}>{sub.braille}</span>
              ))}
            </div>

            {/* 2行目全体：点番号のグループ */}
            <div className={styles.multiDotNumbers}>
              {subCells.map((sub, index) => (
                <span key={index}>[{sub.dots.join(', ')}]</span>
              ))}
            </div>

            {/* 3行目全体：指点字SVGのグループ */}
            <div className={styles.multiFingerBraille}>
              {subCells.map((sub, index) => {
                // サブセルごとの colorType を算出（濁音符等なら "kigou"）
                const finalSubColorType = getSubCellColorType(sub, colorType);

                return (
                  <div key={index} className={styles.subSvgItem}>
                    <FingerBrailleSVG 
                      brailleDots={sub.dots} 
                      colorType={finalSubColorType} 
                    />
                  </div>
                );
              })}
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