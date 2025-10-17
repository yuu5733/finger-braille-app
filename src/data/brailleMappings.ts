// 1. コアライブラリ (※ 無し)

// 2. 型定義 (Type Imports)
import type { BrailleData } from './types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { hexToDots } from '../utils/hexToDots';
import { hexToBraille } from '../utils/hexToBraille';

// 5. 相対パスによるインポート (※ 無し)

// 6. スタイルシート / アセット
import { hiraganaTable, hiraganaKigouTable, numberTable, alphabetTable, brailleCodes } from './table';

// ----------------------------------------------------------------------
// 1つの点字で表現できる基本となるキー（ひらがな、ひらがな用の記号）のマッピングの定義
// ----------------------------------------------------------------------

// スプレッド構文を使って二つのテーブルを結合する（ゑを除く）
const hiraganaTableCopy = { ...hiraganaTable };
delete hiraganaTableCopy['ゑ'];

const combinedTable = {
  ...hiraganaTableCopy,
  ...hiraganaKigouTable,
};

// hiraganaTableCopyをもとにbrailleMappingsを生成（タイピング用）
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

// 点字表用（清音のマッピング）
export const seionMappings: BrailleData[] = Object.entries(hiraganaTable).map(
  ([character, hexCode]) => {
    return {
      character: character, // ひらがな
      dots: hexToDots(hexCode), // 点の配列
      braille: hexToBraille(hexCode), // Unicode点字文字
    };
  }
);

// 点字表用（かな用の記号のマッピング）
export const hiraganaKigouMappings: BrailleData[] = Object.entries(hiraganaKigouTable).map(
  ([character, hexCode]) => {
    return {
      character: character, // 記号
      dots: hexToDots(hexCode), // 点の配列
      braille: hexToBraille(hexCode), // Unicode点字文字
    };
  }
);

const numberTableWithSuFu = {
  // 数字符を先頭に追加（キーは識別のために '数符' とする）
  '数符': brailleCodes.suFu,
  // 元の数字テーブルを展開
  ...numberTable,
  '小数点(.)': 0x02,
  '位取り点(,)': 0x04,
};

// 点字表用（数字用の記号のマッピング）
export const numberMappings: BrailleData[] = Object.entries(numberTableWithSuFu).map(
  ([character, hexCode]) => {
    return {
      character: character, // 数符、数字
      dots: hexToDots(hexCode), // 点の配列
      braille: hexToBraille(hexCode), // Unicode点字文字
    };
  }
);

const alphabetTableWithGaijiFu = {
  // 外字符を先頭に追加（キーは識別のために '外字符' とする）
  '外字符': brailleCodes.gaijiFu,
  '大文字符': brailleCodes.ohmojiFu,
  'つなぎ符': brailleCodes.tsunagiFu,
  '外字引用符(開)': brailleCodes.gaijiinyoFu_kaishi,
  '外字引用符(閉)': brailleCodes.gaijiinyoFu_owari,
  // 元の数字テーブルを展開
  ...alphabetTable, //
};

// 点字表用（外字用の記号のマッピング）
export const alphabetMappings: BrailleData[] = Object.entries(alphabetTableWithGaijiFu).map(
  ([character, hexCode]) => {
    return {
      character: character, // 英語
      dots: hexToDots(hexCode), // 点の配列
      braille: hexToBraille(hexCode), // Unicode点字文字
    };
  }
);