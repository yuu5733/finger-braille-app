// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { BrailleData, BrailleRowData } from './types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import { seionMappings, numberMappings, alphabetMappings } from './brailleMappings'; // 点字表用の点字マッピング

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

const NUMBER_ROW_CHARACTERS: Record<string, string[]> = {
    // 数符と数字 (0〜9) を1行にまとめる
    '数字': ['数符', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 
    '記号(数字)': ['小数点(.)', '位取り点(,)'], 
    // 必要に応じて別の行を追加
};

// アルファベット表の行定義 (10文字ずつ区切る)
const ALPHABET_ROW_CHARACTERS: Record<string, string[]> = {
    '外字符など': ['外字符', '大文字符', 'つなぎ符', '外字引用符(開)', '外字引用符(閉)'],
    'A〜J': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], // 10文字
    'K〜T': ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'], // 10文字
    'U〜Z': ['u', 'v', 'w', 'x', 'y', 'z'], // 6文字
};

// 全マッピングを文字（key）で検索しやすい Map に変換
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

/**
 * 指定された行の文字配列に対応する BrailleData の配列を取得する
 * @param charArray 行を構成する文字の配列
 * @returns BrailleData の配列
 */
const getBrailleCells = (charArray: string[]): BrailleData[] => {
    return charArray.map(char => {
        const data = brailleMap.get(char);
        // マッピングが見つからない場合は、エラーハンドリングまたは空データ
        if (!data) {
            console.warn(`Braille data not found for character: ${char}`);
            // エラーを避けるため、ダミーデータを返す
            return { character: char, braille: '', dots: [] }; 
        }
        return data;
    });
};

// 清音表のデータ生成
export const seionTableData: BrailleRowData[] = Object.entries(SEION_ROW_CHARACTERS).map(([category, charArray]) => ({
    category: category,
    cells: getBrailleCells(charArray),
}));

// 数字表のデータ生成
export const numberTableData: BrailleRowData[] = Object.entries(NUMBER_ROW_CHARACTERS).map(([category, charArray]) => ({
    category: category,
    cells: getBrailleCells(charArray),
}));

// アルファベット表のデータ生成
export const alphabetTableData: BrailleRowData[] = Object.entries(ALPHABET_ROW_CHARACTERS).map(([category, charArray]) => ({
    category: category,
    cells: getBrailleCells(charArray),
}));