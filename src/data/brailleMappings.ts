// 1. コアライブラリ (※ 無し)

// 2. 型定義 (Type Imports)
import type { BrailleData } from './types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { hexToDots } from '../utils/hexToDots';
import { hexToBraille } from '../utils/hexToBraille';

// 5. 相対パスによるインポート (※ 無し)

// 6. スタイルシート / アセット
import { hiraganaTable, hiraganaKigouTable, numberTable, alphabetTable } from './table';

// ----------------------------------------------------------------------
// 1つの点字で表現できる基本となるキー（ひらがな、ひらがな用の記号）のマッピングの定義
// ----------------------------------------------------------------------

// スプレッド構文を使って二つのテーブルを結合する
const hiraganaTableCopy = { ...hiraganaTable };
delete hiraganaTableCopy['ゑ'];

const combinedTable = {
  ...hiraganaTableCopy,
  ...hiraganaKigouTable,
};

// hiraganaTableをもとにbrailleMappingsを生成
// オブジェクトをキーと値のペアの配列に変換する（Object.entries）
export const brailleMappings: BrailleData[] = Object.entries(combinedTable).map(
  ([character, hexCode]) => {
    return {
      character: character, // ひらがな
      dots: hexToDots(hexCode), // 点の配列
      braille: hexToBraille(hexCode), // Unicode点字文字
    };
  }
);

// brailleMappingsから逆引きのマッピングを作成
export const brailleToCharacterMap: { [key: string]: string } = {};
brailleMappings.forEach(mapping => {
  if (mapping.braille) {
    brailleToCharacterMap[mapping.braille] = mapping.character;
  }
});