/* tslint:disable */
/* eslint-disable */
/**
 * 点訳した経路。`BrailleResult.language` の値。
 */

export type BrailleLanguage = "japanese" | "english";

/**
 * 点字セル範囲 → 復元文字列の対応。`BackTransResult.segments` の要素。
 *
 * セル位置は `braille` の添字（点字セルはすべて BMP 内なので UTF-16 単位と一致する）。
 */
export interface BackTransSegment {
    /** 対応する点字セル範囲の先頭（この位置を含む）。 */
    cellStart: number;
    /** 対応する点字セル範囲の終端（この位置を含まない）。 */
    cellEnd: number;
    /** このセル範囲から復元された文字列。 */
    text: string;
}



/**
 * `BrailleBackTranslator.backTranslateAligned()` の結果。
 */
export class BackTransResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 点字セル範囲 → 文字列のセグメント列。範囲は半開区間 `[cellStart, cellEnd)`。
     *
     * 参照のたびに新しい配列とオブジェクトを作るので、ループ内では変数に受けてから使う。
     */
    readonly segments: BackTransSegment[];
    /**
     * 復元された全文（`segments` のテキストを連結したものと一致する）。
     */
    readonly text: string;
}

/**
 * `BrailleBackTranslator.step()` / `flush()` が引き継ぐ行内状態。
 *
 * 不透明なハンドル。JS 側は中身を参照せず、次回の `step`/`flush` にそのまま渡す。
 */
export class BackTransState {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 保留セルが残っていない（行末で `flush` が不要）か。
     */
    isSettled(): boolean;
    /**
     * 初期状態（行頭）を生成する。
     */
    constructor();
}

/**
 * 点字をかな・記号・数字・ラテン文字に逆変換する。
 *
 * 順変換 `BrailleTranslator` と異なりモデル（.mbm）不要で、組み込みテーブルのみで動作する。
 *
 * ```js
 * const bt = new BrailleBackTranslator();
 * console.log(bt.backTranslate("⠁⠃⠉⠋⠊")); // アイウエオ
 * ```
 */
export class BrailleBackTranslator {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 点字セル列を逆変換し、復元文字列と点字セル範囲⇔文字列の対応を返す。
     *
     * エディタでの読みガイド表示など、点字セル位置と復元文字を対応付けたい用途向け。
     */
    backTranslateAligned(braille: string): BackTransResult;
    /**
     * 点字セル列を文字列に逆変換して返す。
     */
    backTranslate(braille: string): string;
    /**
     * 行末で呼び、保留中のセル（結合待ちの前置セルなど）を確定させる。
     *
     * `BackTransState.isSettled()` が `false` のまま行が終わる場合に呼ぶ。
     */
    flush(state: BackTransState): StepResult;
    /**
     * 組み込みテーブルからインスタンスを構築する。
     */
    constructor();
    /**
     * 点字 1 セルを逐次逆変換する（エディタでの逐次入力向け）。
     *
     * `cell` は点字 1 セル分の文字列（先頭の 1 文字のみ使用）。
     * 行頭では `new BackTransState()` の初期状態を渡し、以降は返り値の
     * `StepResult.state` を次回呼び出しに渡して、数符・外字符・濁音前置
     * などの行内状態を引き継ぐ。前置セル（濁音など）の直後は `text` が空になる
     * ことがある（次のセルと結合して確定するまで保留されるため）。
     */
    step(cell: string, state: BackTransState): StepResult;
}

/**
 * 点字変換結果。`BrailleTranslator.translate()` 等の戻り値。
 *
 * テキスト側の文字位置はコードポイント単位（`Array.from(text)` の添字）。点字セルは
 * すべて BMP 内（U+2800 台）なので、セル位置は `braille` の添字（UTF-16 単位）と一致する。
 */
export class BrailleResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 点字のセル位置 → テキストの文字位置。
     *
     * 参照のたびに新しい配列を作るので、ループ内では変数に受けてから使う。
     */
    readonly brailleToText: Uint32Array;
    /**
     * 変換後の点字文字列。
     */
    readonly braille: string;
    /**
     * 点訳した経路（`"japanese"` / `"english"`）。
     */
    readonly language: BrailleLanguage;
    /**
     * テキストの文字位置 → 対応する点字の先頭セル位置。
     *
     * 参照のたびに新しい配列を作るので、ループ内では変数に受けてから使う。
     */
    readonly textToBraille: Uint32Array;
    /**
     * 点訳したテキスト（日本語=かな / 英語=英文）。
     */
    readonly text: string;
}

/**
 * 点訳器。読み（かな／英文）を点字に変換する。行の言語を判定して日本語／英語へ振り分ける。
 *
 * 入力は**読みに変換済みのテキスト**（日本語ならカナ）。漢字かな交じり文はまず
 * `Predictor.predict()` でカナにしてから渡す。
 *
 * ```js
 * const t = new BrailleTranslator();
 * console.log(t.translate("ワガハイワネコデアル").braille);
 * console.log(t.translate("you should be here today").braille); // UEB grade 2
 * ```
 */
export class BrailleTranslator {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 組み込みテーブル（日本語１級 + UEB grade 2）で変換器を作る。
     */
    constructor();
    /**
     * 言語判定せず、必ず英語（UEB）として点訳する。
     */
    translateEnglish(text: string): BrailleResult;
    /**
     * 言語判定せず、必ず日本語として点訳する（英字は外字符 ⠰ ＋無縮約）。
     */
    translateJapanese(kana: string): BrailleResult;
    /**
     * 1行を言語判定して点字に変換する（日本語=かな / 英語=UEB）。
     */
    translate(text: string): BrailleResult;
}

/**
 * 予測結果。`Predictor.predict()` の戻り値。
 *
 * 文字位置はすべてコードポイント単位（`Array.from(source)` / `Array.from(kana)` の添字）。
 * JS 文字列の添字（UTF-16 単位）とは、サロゲートペアの文字（𠮟・𩸽 など）より後ろでずれる。
 */
export class PredictionResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 各カナ文字の自信度（0.0〜1.0）。`Array.from(kana)` の各要素に対応する。
     *
     * 参照のたびに新しい配列を作るので、ループ内では変数に受けてから使う。
     */
    readonly confidences: Float32Array;
    /**
     * かなの文字位置 → 原文の文字位置（いずれもコードポイント単位）。
     *
     * 参照のたびに新しい配列を作るので、ループ内では変数に受けてから使う。
     */
    readonly kanaToSource: Uint32Array;
    /**
     * 変換後のカナ文字列。
     */
    readonly kana: string;
    /**
     * 分かち書きされたカナ（`ワガハイ/ワ/ネコ/デ/アル` 形式）。
     */
    readonly segmented: string;
    /**
     * 分かち書きされた原文（`吾輩/は/猫/で/ある` 形式）。
     */
    readonly sourceSegmented: string;
    /**
     * 原文の文字位置 → かなの文字位置の配列（いずれもコードポイント単位）。
     *
     * 原文 1 文字が複数のかなに対応しうるため配列の配列になる。
     * 参照のたびに外側・内側の配列をすべて作り直すので、ループ内では変数に受けてから使う。
     */
    readonly sourceToKana: Uint32Array[];
    /**
     * 入力文字列（原文）。
     */
    readonly source: string;
}

/**
 * 漢字かな交じり文 → カナ変換器。
 *
 * ```js
 * const p = new Predictor(mbmBytes);
 * const r = p.predict("吾輩は猫である");
 * console.log(r.kana);           // ワガハイワネコデアル
 * console.log(r.sourceSegmented); // 吾輩/は/猫/で/ある
 * ```
 */
export class Predictor {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * モデルバイト列 (.mbm) からインスタンスを構築する。
     */
    constructor(mbmData: Uint8Array | number[]);
    /**
     * テキストをカナに変換する。
     */
    predict(text: string): PredictionResult;
}

/**
 * `BrailleBackTranslator.step()` / `flush()` の結果。
 */
export class StepResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 更新後の状態。次の `step`/`flush` にそのまま渡す。
     */
    readonly state: BackTransState;
    /**
     * このセルで確定した文字列。前置セルの保留中は空、拗音などは 2 文字になりうる。
     */
    readonly text: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_backtransresult_free: (a: number, b: number) => void;
    readonly __wbg_backtransstate_free: (a: number, b: number) => void;
    readonly __wbg_braillebacktranslator_free: (a: number, b: number) => void;
    readonly __wbg_brailleresult_free: (a: number, b: number) => void;
    readonly __wbg_brailletranslator_free: (a: number, b: number) => void;
    readonly __wbg_predictionresult_free: (a: number, b: number) => void;
    readonly __wbg_predictor_free: (a: number, b: number) => void;
    readonly __wbg_stepresult_free: (a: number, b: number) => void;
    readonly backtransresult_segments: (a: number) => any;
    readonly backtransresult_text: (a: number) => [number, number];
    readonly backtransstate_isSettled: (a: number) => number;
    readonly backtransstate_new: () => number;
    readonly braillebacktranslator_backTranslate: (a: number, b: number, c: number) => [number, number];
    readonly braillebacktranslator_backTranslateAligned: (a: number, b: number, c: number) => number;
    readonly braillebacktranslator_flush: (a: number, b: number) => number;
    readonly braillebacktranslator_new: () => [number, number, number];
    readonly braillebacktranslator_step: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly brailleresult_braille: (a: number) => [number, number];
    readonly brailleresult_brailleToText: (a: number) => [number, number];
    readonly brailleresult_language: (a: number) => number;
    readonly brailleresult_text: (a: number) => [number, number];
    readonly brailleresult_textToBraille: (a: number) => [number, number];
    readonly brailletranslator_new: () => [number, number, number];
    readonly brailletranslator_translate: (a: number, b: number, c: number) => [number, number, number];
    readonly brailletranslator_translateEnglish: (a: number, b: number, c: number) => [number, number, number];
    readonly brailletranslator_translateJapanese: (a: number, b: number, c: number) => [number, number, number];
    readonly predictionresult_confidences: (a: number) => [number, number];
    readonly predictionresult_kana: (a: number) => [number, number];
    readonly predictionresult_kanaToSource: (a: number) => [number, number];
    readonly predictionresult_segmented: (a: number) => [number, number];
    readonly predictionresult_source: (a: number) => [number, number];
    readonly predictionresult_sourceSegmented: (a: number) => [number, number];
    readonly predictionresult_sourceToKana: (a: number) => any;
    readonly predictor_new: (a: number, b: number) => [number, number, number];
    readonly predictor_predict: (a: number, b: number, c: number) => [number, number, number];
    readonly stepresult_state: (a: number) => number;
    readonly stepresult_text: (a: number) => [number, number];
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
