// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { BrailleData, BrailleRowData } from './types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import { 
    seionMap, 
    kigouMap, 
    numberMap, 
    alphabetMap, 
    specialMap,
    dakuonAndHandakuonMap,
    youonMap,
    ryakugoMappings,
} from './brailleMappings'; // 点字表用の点字マッピング

const SEION_ROW_CHARACTERS: Record<string, string[]> = {
    'あ行': ['あ', 'い', 'う', 'え', 'お'],
    'か行': ['か', 'き', 'く', 'け', 'こ'],
    'さ行': ['さ', 'し', 'す', 'せ', 'そ'],
    'た行': ['た', 'ち', 'つ', 'て', 'と'],
    'な行': ['な', 'に', 'ぬ', 'ね', 'の'],
    'は行': ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    'ま行': ['ま', 'み', 'む', 'め', 'も'],
    'や行': ['や', 'ゆ', 'よ'],
    'ら行': ['ら', 'り', 'る', 'れ', 'ろ'],
    'わ行': ['わ', 'ゐ', 'ゑ', 'を'], 
    '撥音、促音、長音': ['ん', 'っ', 'ー'], 
};

const KIGOU_ROW_CHARACTERS: Record<string, string[]> = {
    '記号': ['。(終止符)', '？(疑問符)', '「 or つなぎ符', '通訳者引用符',],
    'かっこ': ['「」(第一カギ)', '丸カッコ',],
};

const DAKUON_ROW_CHARACTERS: Record<string, string[]> = {
    'が行': ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
    'ざ行': ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
    'だ行': ['だ', 'ぢ', 'づ', 'で', 'ど'],
    'ば行': ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
};

const HANDAKUON_ROW_CHARACTERS: Record<string, string[]> = {
    'ぱ行': ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
};

const YOUON_ROW_CHARACTERS: Record<string, string[]> = {
    'きゃ行': ['きゃ', 'きゅ', 'きょ'],
    'しゃ行': ['しゃ', 'しゅ', 'しょ'],
    'ちゃ行': ['ちゃ', 'ちゅ', 'ちょ'],
    'にゃ行': ['にゃ', 'にゅ', 'にょ'],
    'ひゃ行': ['ひゃ', 'ひゅ', 'ひょ'],
    'みゃ行': ['みゃ', 'みゅ', 'みょ'],
    'りゃ行': ['りゃ', 'りゅ', 'りょ'],
    'ぎゃ行': ['ぎゃ', 'ぎゅ', 'ぎょ'],
    'じゃ行': ['じゃ', 'じゅ', 'じょ'],
    'ぢゃ行': ['ぢゃ', 'ぢゅ', 'ぢょ'],
    'びゃ行': ['びゃ', 'びゅ', 'びょ'],
    'ぴゃ行': ['ぴゃ', 'ぴゅ', 'ぴょ'],
};

const NUMBER_ROW_CHARACTERS: Record<string, string[]> = {
    // 数符と数字 (0〜9) を1行にまとめる
    '記号など(数字)': ['数符', '小数点(.)', 'つなぎ符', '位取り点(,)'/*, 'ｱﾎﾟｽﾄﾛﾌｨ(\')'*/], 
    '数字': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 
    // 必要に応じて別の行を追加
};

// アルファベット表の行定義 (10文字ずつ区切る)
const ALPHABET_ROW_CHARACTERS: Record<string, string[]> = {
    '外字符など': ['外字符', '大文字符', 'つなぎ符', '外字引用符(開)', '外字引用符(閉)'],
    'A〜J': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], // 10文字
    'K〜T': ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'], // 10文字
    'U〜Z': ['u', 'v', 'x', 'y', 'z', 'w'], // 6文字
};

const TOKUSHU_ROW_CHARACTERS: Record<string, string[]> = {
    'w系特殊音（疑問符 [2,6]点 ＋ 母音）': ['うぃ', 'うぇ', 'うぉ'],
    'kw系特殊音（疑問符 [2,6]点 ＋ か行）': ['くぁ', 'くぃ', 'くぇ', 'くぉ'],
    'gw系特殊音（句点 [2,5,6] ＋ か行）': ['ぐぁ', 'ぐぃ', 'ぐぇ', 'ぐぉ'],
    'tw系特殊音（疑問符 [2,6] ＋ た行）': ['つぁ', 'つぃ', 'つぇ', 'つぉ'],
    'f系特殊音（疑問符 [2,6] ＋ は行）': ['ふぁ', 'ふぃ', 'ふぇ', 'ふぉ'],
    'v系特殊音・有声唇摩擦音（句点/濁点符）': ['ゔぃ', 'ゔ', 'ゔぇ', 'ゔぉ'],
    'ye系特殊音（拗[濁]音符 ＋ エ段）': [  'いぇ', 'きぇ', 'しぇ', 'じぇ', 'ちぇ', 'にぇ', 'ひぇ'],
    'swi、thi系特殊音（拗[濁]音符）': ['すぃ', 'てぃ', 'ずぃ', 'でぃ'],
    'twu (dwu)系特殊音（疑問符/句点 ＋ つ）': ['とぅ', 'どぅ'],
    'thu、fyu、fyo系特殊音（拗半濁音符、[4,5,6]点）': ['てゅ', 'ふゅ', 'ふょ', 'でゅ', 'ぶゅ', 'ぶょ'], // thu、fyu、fyo、dhu
};

// ----------------------------------------------------------------------

/**
 * 共通のテーブル生成ヘルパー関数
 * カテゴリごとの文字配列に対応する BrailleRowData の配列を生成する
 * @param rowCharacters 行を構成するカテゴリと文字配列のマッピング
 * @param map 文字に対応する BrailleData が格納されたマップ
 * @returns BrailleRowData の配列
 */
const createTableData = (
  rowCharacters: Record<string, string[]>, 
  map: Map<string, BrailleData>
): BrailleRowData[] => {
  return Object.entries(rowCharacters).map(([category, charArray]) => ({
    category,
    cells: charArray.map(char => map.get(char) || { character: char, braille: '', dots: [] }),
  }));
};
// 【出力結果】
// [
//   {
//     category: 'あ行',
//     cells: [
//       { character: 'あ', braille: '⠁', dots: [1] },
//       { character: 'い', braille: '⠃', dots: [1, 2] },
//       // ... ウ、エ、オ が続く
//     ]
//   },
// ]

// 清音表のデータ生成
export const seionTableData = createTableData(SEION_ROW_CHARACTERS, seionMap);

// 記号表のデータ生成を追加
export const kigouTableData = createTableData(KIGOU_ROW_CHARACTERS, kigouMap);

// 濁音・半濁音表のデータ生成
export const dakuonAndHandakuonTableData = createTableData(
    { ...DAKUON_ROW_CHARACTERS, ...HANDAKUON_ROW_CHARACTERS }, 
    dakuonAndHandakuonMap
);

// 拗音表のデータ生成を追加
export const youonTableData = createTableData(YOUON_ROW_CHARACTERS, youonMap);

// 数字表のデータ生成
export const numberTableData = createTableData(NUMBER_ROW_CHARACTERS, numberMap);

// アルファベット表のデータ生成
export const alphabetTableData = createTableData(ALPHABET_ROW_CHARACTERS, alphabetMap);

// 特殊音表のデータ生成
export const tokushuTableData = createTableData(TOKUSHU_ROW_CHARACTERS, specialMap);

// よく使う略語のデータ生成
export const ryakugoTableData: BrailleRowData[] = [
  {
    category: 'よく使う略語',
    cells: ryakugoMappings || [],
  },
];

