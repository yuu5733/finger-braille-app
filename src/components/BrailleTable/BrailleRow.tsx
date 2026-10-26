// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleRowData, BrailleColorType } from '../../data/types'; 

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import BrailleCell from './BrailleCell';

// 6. スタイルシート / アセット
import styles from './BrailleRow.module.css';

interface BrailleRowProps extends BrailleRowData {}

const BrailleRow: FC<BrailleRowProps> = ({ category, cells, colorType: rowColorTypeProp }) => {
  const isNumberOrAlphabetRow = category === '数字' || category === 'A〜J' || category === 'K〜T' || category === 'U〜Z'; 
  const isLongCharacter = category === '記号など(数字)' || category === '外字符など' || category === '記号' || category === 'かっこ'; 
  const isRyakugoRow = category === 'よく使う略語';

  const gridClassName = isRyakugoRow
    ? styles.ryakugoRowGrid
    : `${styles.brailleRowGrid} ${isNumberOrAlphabetRow ? styles.maxFiveColumnGrid : ''} ${isLongCharacter ? styles.gaijiFuGrid : ''}`;

  // カテゴリから デフォルトの colorType を判定する関数
  const getRowType = (cat: string): BrailleColorType => {
    if (cat === 'や行') return 'yagyou';
    if (cat === 'わ行') return 'wagyou';
    if (cat === '数字') return 'number';
    if (cat === 'A〜J' || cat === 'K〜T' || cat === 'U〜Z' || cat === 'よく使う略語') return 'alphabet';
    if (cat === '記号' || cat === 'かっこ' || cat === '記号など(数字)' || cat === '外字符など') return 'kigou';
    return 'hiragana';
  };

  // Rowプロパティから渡された色、またはカテゴリから算出した色を行全体のデフォルトとする
  const defaultRowType = getRowType(category);
  const rowColorType = rowColorTypeProp || defaultRowType;

  return (
    <section className={styles.brailleRowSection}>
      {/* 1. カテゴリ見出し */}
      <h3 className={styles.categoryHeader}>
        {category}
      </h3>

      {/* 2. セルを並べるグリッドコンテナ (ul) */}
      <ul className={gridClassName}>
        {cells.map((data) => {
          // Cellレベルの指定があればそれを優先し、なければRowレベルのデフォルトを適用
          const finalColorType = data.colorType || rowColorType;

          return (
            <BrailleCell
              key={data.character}
              character={data.character}
              braille={data.braille}
              dots={data.dots}
              subCells={data.subCells}
              columnSpan={data.columnSpan}
              comment={data.comment}
              flag={data.character.length > 4 ? true : false}
              colorType={finalColorType}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default BrailleRow;