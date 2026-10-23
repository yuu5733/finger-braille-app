// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { BrailleData, BrailleRowData } from './types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import { 
    seionMappings, 
    hiraganaKigouMappings, 
    dakuonMappings, 
    handakuonMappings, 
    youonMappings,
    youdakuonMappings,
    youhandakuonMappings,
    numberMappings, 
    alphabetMappings, 
    ryakugoMappings,
    specialMappings, 
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

// 濁音と半濁音のマップ作成
const dakuonAndHandakuonMap = new Map<string, BrailleData>();
[...dakuonMappings, ...handakuonMappings].forEach(data => {
    dakuonAndHandakuonMap.set(data.character, data);
});

// 濁音・半濁音表のデータ生成
export const dakuonAndHandakuonTableData: BrailleRowData[] = Object.entries({...DAKUON_ROW_CHARACTERS, ...HANDAKUON_ROW_CHARACTERS }).map(([category, charArray]) => ({
    category: category,
    cells: charArray.map(char => dakuonAndHandakuonMap.get(char) || { character: char, braille: '', dots: [] }),
}));

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

// 拗音・拗濁音・拗半濁音のマップ作成
const youonMap = new Map<string, BrailleData>();
[...youonMappings, ...youdakuonMappings, ...youhandakuonMappings].forEach(data => {
    youonMap.set(data.character, data);
});

// 拗音表のデータ生成
export const youonTableData: BrailleRowData[] = Object.entries(YOUON_ROW_CHARACTERS).map(([category, charArray]) => ({
    category: category,
    cells: charArray.map(char => youonMap.get(char) || { character: char, braille: '', dots: [] }),
}));

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
    'ye特殊音（拗[濁]音符 ＋ エ段）': [  'いぇ', 'きぇ', 'しぇ', 'じぇ', 'ちぇ', 'にぇ', 'ひぇ'],
    'swi、thi系特殊音（拗[濁]音符）': ['すぃ', 'てぃ', 'ずぃ', 'でぃ'],
    'twu系特殊音（疑問符/句点 ＋ つ）': ['とぅ', 'どぅ'],
    'thu、fyu、fyo系特殊音（拗半濁音符、[4,5,6]点）': ['てゅ', 'ふゅ', 'ふょ', 'でゅ', 'ぶゅ', 'ぶょ'], // thu、fyu、fyo、dhu
};


// 全マッピングを文字（key）で検索しやすい Map に変換
// 変換処理で使用する。展示表では、コメントを変えることがあるので統合したものは用いない
// seionMappings をマップに追加
const brailleMap = new Map<string, BrailleData>();
for (const data of seionMappings) {
    brailleMap.set(data.character, data);
}
// numberMappings をマップに追加
for (const data of numberMappings) {
    brailleMap.set(data.character, data);
}

// alphabetMappings をマップに追加 (大文字キーを使用)
for (const data of alphabetMappings) {
    brailleMap.set(data.character, data);
}

// ----------------------------------------------------------------------

// 指点字表用に独立した Map を作成する
const seionMap = new Map<string, BrailleData>();
seionMappings.forEach(data => seionMap.set(data.character, data));

const kigouMap = new Map<string, BrailleData>();
hiraganaKigouMappings.forEach(data => kigouMap.set(data.character, data));

const numberMap = new Map<string, BrailleData>();
numberMappings.forEach(data => numberMap.set(data.character, data));

const alphabetMap = new Map<string, BrailleData>();
alphabetMappings.forEach(data => alphabetMap.set(data.character, data));

const specialMap = new Map<string, BrailleData>();
specialMappings.forEach(data => specialMap.set(data.character, data));

// ----------------------------------------------------------------------

/**
 * 指定された行の文字配列に対応する BrailleData の配列を取得する
 * @param charArray 行を構成する文字の配列
 * @returns BrailleData の配列
 */
// const getBrailleCells = (charArray: string[]): BrailleData[] => {
//     return charArray.map(char => {
//         const data = brailleMap.get(char);
//         // マッピングが見つからない場合は、エラーハンドリングまたは空データ
//         if (!data) {
//             console.warn(`Braille data not found for character: ${char}`);
//             // エラーを避けるため、ダミーデータを返す
//             return { character: char, braille: '', dots: [] }; 
//         }
//         return data;
//     });
// };

// 清音表のデータ生成
export const seionTableData: BrailleRowData[] = Object.entries(SEION_ROW_CHARACTERS).map(([category, charArray]) => ({
    category: category,
    cells: charArray.map(char => seionMap.get(char) || { character: char, braille: '', dots: [] }),
}));

// 記号表のデータ生成を追加
export const kigouTableData: BrailleRowData[] = Object.entries(KIGOU_ROW_CHARACTERS).map(([category, charArray]) => ({
    category: category,
    cells: charArray.map(char => kigouMap.get(char) || { character: char, braille: '', dots: [] }),
}));

// 数字表のデータ生成
export const numberTableData: BrailleRowData[] = Object.entries(NUMBER_ROW_CHARACTERS).map(([category, charArray]) => ({
    category: category,
    cells: charArray.map(char => numberMap.get(char) || { character: char, braille: '', dots: [] }),
}));

// アルファベット表のデータ生成
export const alphabetTableData: BrailleRowData[] = Object.entries(ALPHABET_ROW_CHARACTERS).map(([category, charArray]) => ({
    category: category,
    cells: charArray.map(char => alphabetMap.get(char) || { character: char, braille: '', dots: [] }),
}));

// よく使う略語のデータ生成
export const ryakugoTableData: BrailleRowData[] = [
  {
    category: 'よく使う略語',
    cells: ryakugoMappings || [],
  },
];

// 特殊音表のデータ生成
export const tokushuTableData: BrailleRowData[] = Object.entries(TOKUSHU_ROW_CHARACTERS).map(([category, charArray]) => ({
    category: category,
    cells: charArray.map(char => specialMap.get(char) || { character: char, braille: '', dots: [] }),
}));