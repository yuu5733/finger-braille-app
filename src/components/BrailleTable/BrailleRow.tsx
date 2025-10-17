// 1. コアライブラリ
import React from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleRowData } from '../../data/types'; 

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import BrailleCell from './BrailleCell';
import styles from './BrailleRow.module.css';

interface BrailleRowProps extends BrailleRowData {}

const BrailleRow: FC<BrailleRowProps> = ({ category, cells }) => {
  const isNumberOrAlphabetRow = category === '数字' || category === 'A〜J' || category === 'K〜T' || category === 'U〜Z'; 
  const isGaijifu = category === '外字符など'; 

    const gridClassName = `${styles.brailleRowGrid} ${isNumberOrAlphabetRow ? styles.maxFiveColumnGrid : ''} ${isGaijifu ? styles.gaijiFuGrid : ''}`;


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
            brailleChar={data.braille}
            dots={data.dots}
          />
        ))}
      </ul>
    </section>
  );
};

export default BrailleRow;