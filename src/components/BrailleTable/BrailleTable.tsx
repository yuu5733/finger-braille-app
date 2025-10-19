// 1. コアライブラリ
import React from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleRowData } from '../../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import BrailleRow from './BrailleRow';
import styles from './BrailleTable.module.css';

interface BrailleTableProps {
    h2_text: string;
    id: string; // アンカーリンク用のID
    tableData: BrailleRowData[]; // 表示する表データを受け取る
} 

const BrailleTable: FC<BrailleTableProps> = ({h2_text, id, tableData}) => {
    return (
        <div id={id} className={styles.tableWrapper}>
            <h2 className={styles.tableHeader}>{h2_text}｜指点字表</h2>
            
            <div className={styles.tableContent}>
                {/* propsで渡された tableData をマップして表示 */}
                {tableData.map((rowData) => (
                    <BrailleRow 
                        key={rowData.category}
                        category={rowData.category}
                        cells={rowData.cells}
                    />
                ))}
            </div>
        </div>
    );
};

export default BrailleTable;