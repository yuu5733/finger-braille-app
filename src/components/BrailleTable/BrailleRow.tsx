// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleRowData } from '../../data/types'; 

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import BrailleCell from './BrailleCell';

// 6. スタイルシート / アセット
import styles from './BrailleRow.module.css';

interface BrailleRowProps extends BrailleRowData {}

const BrailleRow: FC<BrailleRowProps> = ({ category, cells }) => {
  const isNumberOrAlphabetRow = category === '数字' || category === 'A〜J' || category === 'K〜T' || category === 'U〜Z'; 
  const isLongCharacter = category === '記号など(数字)' || category === '外字符など' || category === '記号' || category === 'かっこ'; 
  const isRyakugoRow = category === 'よく使う略語';

  const gridClassName = isRyakugoRow
    ? styles.ryakugoRowGrid
    : `${styles.brailleRowGrid} ${isNumberOrAlphabetRow ? styles.maxFiveColumnGrid : ''} ${isLongCharacter ? styles.gaijiFuGrid : ''}`;

  // カテゴリから type を判定する関数
  const getCellType = (cat: string): 'hiragana' | 'alphabet' | 'number' => {
    if (cat === '数字') return 'number';
    if (cat === 'A〜J' || cat === 'K〜T' || cat === 'U〜Z' || cat === 'よく使う略語') return 'alphabet';
    return 'hiragana';
  };

  const cellType = getCellType(category);

  return (
    <section className={styles.brailleRowSection}>
      {/* 1. カテゴリ見出し */}
      <h3 className={styles.categoryHeader}>
        {category}
      </h3>

      {/* 2. セルを並べるグリッドコンテナ (ul) */}
      <ul className={gridClassName}>
        {cells.map((data) => (
          <BrailleCell
            key={data.character} // characterをkeyに使用
            character={data.character}
            braille={data.braille}
            dots={data.dots}
            subCells={data.subCells}
            columnSpan={data.columnSpan}
            comment={data.comment}
            flag={data.character.length > 4 ? true : false}
            type={cellType}
          />
        ))}
      </ul>
    </section>
  );
};

export default BrailleRow;