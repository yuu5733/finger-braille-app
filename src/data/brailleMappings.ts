// 1. コアライブラリ (※ 無し)

// 2. 型定義 (Type Imports)
import type { BrailleData, BrailleRowData } from './types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { hexToDots } from '../utils/hexToDots';
import { hexToBraille } from '../utils/hexToBraille';

// 5. 相対パスによるインポート (※ 無し)

// 6. スタイルシート / アセット
import { hiraganaTable, hiraganaKigouTable, kigouTable_yubitenjiChart, numberTable, alphabetTable, brailleCodes } from './table';

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

const commentMapHiraganaKigou: Record<string, string> = {
  '。(終止符)': '指点字ではそんなに使わない\n話が終わったと明確に示したいときに使う',
  '？(疑問符)': '疑問はモダリティ（確信、推量、許可など）\nに当たり大事',
  '「（つなぎ符）': '話者を示すときに使う\n例）たなか「',
  '通訳者引用符': '補足・状況説明\n誰に対しての質問なのか。相手の様子（笑っている）など',
    '「」(第一カギ)': '3, 6点で最初と最後をくくる',
  '丸カッコ': '2, 3, 5, 6点で最初と最後をくくる',
};

// 点字表用（かな用の記号のマッピング）
export const hiraganaKigouMappings: BrailleData[] = Object.entries(kigouTable_yubitenjiChart).map(
  ([character, hexCode]) => {
    return {
      character: character, // 記号
      dots: hexToDots(hexCode), // 点の配列
      braille: hexToBraille(hexCode), // Unicode点字文字
      comment: commentMapHiraganaKigou[character], // コメント（覚えやすくするため）
    };
  }
);

const numberTableWithSuFu = {
  // 数字符を先頭に追加（キーは識別のために '数符' とする）
  '数符': brailleCodes.suFu,
  // 元の数字テーブルを展開
  ...numberTable,
  'つなぎ符': brailleCodes.tsunagiFu,
  '小数点(.)': 0x02,
  '位取り点(,)': 0x04,
};

// 文字（または数字）ごとのコメント（語呂合わせなど）を定義する辞書
const commentMapSuji: Record<string, string> = {
  '数符': '次に来る文字が、数字であることを示す\n数字が続く場合は、打たなくて良い',
  '小数点(.)': '促音の「っ」に同じ。\n例）たいおんが(間)[数符] 36.5ど',
  'つなぎ符': '数字の後に、あ行・ら行が続く時に使用\n例）[数符] 50 [つなぎ符] えん',
  '位取り点(,)': '万(千)を使うので、基本的に使わない\n[数符] 1まん [数符] 5000にん',

  '1': 'ひらがなの「あ」に同じ\n【ゴロ】い(1)「あ」いあ！',
  '2': 'ひらがなの「い」に同じ\n【ゴロ】に(2)「い」にい',
  '3': 'ひらがなの「う」に同じ\n【ゴロ】さん(3)「う」（山雨）',
  '4': 'ひらがなの「る」に同じ\n【ゴロ】し(4)「る」（知る）',
  '5': 'ひらがなの「ら」に同じ\n【ゴロ】コ(5)ー「ラ」',
  '6': 'ひらがなの「え」に同じ\n【ゴロ】ろく(6)「え」ん（6円）',
  '7': 'ひらがなの「れ」に同じ\n【ゴロ】な(7)「れ」（慣れ）',
  '8': 'ひらがなの「り」に同じ\n【ゴロ】は(8)「り」（針）',
  '9': 'ひらがなの「お」に同じ\n【ゴロ】ク(9)「オ」カード',
  '0': 'ひらがなの「ろ」に同じ\n【ゴロ】ぜ「ろ」（零）',
};

// 点字表用（数字用の記号のマッピング）
export const numberMappings: BrailleData[] = Object.entries(numberTableWithSuFu).map(
  ([character, hexCode]) => {
    return {
      character: character, // 数符、数字
      dots: hexToDots(hexCode), // 点の配列
      braille: hexToBraille(hexCode), // Unicode点字文字
      comment: commentMapSuji[character], // コメント（覚えやすくするため）
    };
  }
);

const commentMapAlphabet: Record<string, string> = {
  '外字符': '次に来る文字が、\nアルファベットであることを示す',
  'つなぎ符': '複合語で用いる\n例）[外字符] SNS [つなぎ符] うんよう',
  '大文字符': '大文字だと示す。指点字では使わないことも多い。\n2回使うとすべて大文字　例) [外][大][大]NHK',
  '外字引用符(開)': '外国語の文を引用するときなどに使う\n[外引開]nothing about us without us[外引閉]',
  '外字引用符(閉)': '外国語の文を引用するときなどに使う\n[外引開]Life is a daring adventure.[外引閉]',

  'a': 'ひらがなの「あ」に同じ。\n数字の「1」と同じ',
  'b': 'ひらがなの「い」に同じ。\n数字の「2」と同じ',
  'c': 'ひらがなの「う」に同じ。\n数字の「3」と同じ',
  'd': 'ひらがなの「る」に同じ。\n数字の「4」と同じ',
  'e': 'ひらがなの「ら」に同じ。\n数字の「5」と同じ',

  'f': 'ひらがなの「え」に同じ。\n数字の「6」と同じ',
  'g': 'ひらがなの「れ」に同じ。\n数字の「7」と同じ',
  'h': 'ひらがなの「り」に同じ。\n数字の「8」と同じ',
  'i': 'ひらがなの「お」に同じ。\n数字の「9」と同じ',
  'j': 'ひらがなの「ろ」に同じ。\n数字の「0」と同じ',

  'k': 'ひらがなの「な」に同じ。\n「1」(=a) に3点。',
  'l': 'ひらがなの「に」に同じ。\n「2」(=b) に3点。',
  'm': 'ひらがなの「ぬ」に同じ。\n「3」(=c) に3点。',
  'n': 'ひらがなの「つ」に同じ。\n「4」(=d) に3点。',
  'o': 'ひらがなの「た」に同じ。\n「5」(=e) に3点。',

  'p': 'ひらがなの「ね」に同じ。\n「6」(=f) に3点。',
  'q': 'ひらがなの「て」に同じ。\n「7」(=g) に3点。',
  'r': 'ひらがなの「ち」に同じ。\n「8」(=h) に3点。',
  's': 'ひらがなの「の」に同じ。\n「9」(=i) に3点。',
  't': 'ひらがなの「と」に同じ。\n「0」(=j) に3点。',

  'u': 'ひらがなの「は」に同じ。\n「1」(=a) に3と6の点。',
  'v': 'ひらがなの「ひ」に同じ。\n「2」(=b) に3と6の点。',
  'w': '特殊。ひらがなの「そ」に同じ。\n「J」に6の点。',
  'x': 'ひらがなの「ふ」に同じ。\n「3」(=c) に3と6の点。',
  'y': 'ひらがなの「む」に同じ。\n「4」(=d) に3と6の点。',
  'z': 'ひらがなの「ま」に同じ。\n「5」(=e) に3と6の点。',
};

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
      comment: commentMapAlphabet[character], // コメント（覚えやすくするため）
    };
  }
);

// --- 略語・外来語データの自動生成関数 ---
/**
 * 略語の文字列（例: "ATM", "JR"）から、外字符＋各文字の点字データを自動生成する
 */
export const createRyakugoData = (word: string, comment?: string): BrailleData => {
  // 1. 先頭に外字符を追加
  const subCells = [
    {
      character: '外字符',
      braille: hexToBraille(brailleCodes.gaijiFu),
      dots: hexToDots(brailleCodes.gaijiFu),
    },
    // 2. 文字列の各文字をアルファベットテーブルから変換
    ...word.split('').map(char => {
      const lowerChar = char.toLowerCase();
      const hexCode = alphabetTable[lowerChar] ?? 0x00;
      return {
        character: char,
        braille: hexToBraille(hexCode),
        dots: hexToDots(hexCode),
      };
    }),
  ];

  return {
    character: word,
    subCells,
    columnSpan: subCells.length,
    comment: comment || `外来語・略語: ${word}`,
  };
};

interface RyakugoItem {
  word: string;
  comment?: string;
}

// よく使う略語の一覧からマッピングを自動生成
const ryakugoList: RyakugoItem[] = [
  { word: 'JR', comment: 'ろち' },
  { word: 'ATM', comment: 'あとぬ' },
  { word: 'NHK', comment: 'つりな' },
  { word: 'AI', comment: 'あお' },
  { word: 'IT', comment: 'おと' },
];

// 各略語ごとに独立した行（category）としてデータを生成する
export const ryakugoMappings: BrailleData[] = ryakugoList.map(item =>
  createRyakugoData(item.word, `ひらがなでは「${item.comment}」`)
);