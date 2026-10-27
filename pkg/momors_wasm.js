/* @ts-self-types="./momors_wasm.d.ts" */

/**
 * [`BrailleBackTranslator::back_translate_aligned`] の結果。
 */
export class BackTransResult {
    static __wrap(ptr) {
        const obj = Object.create(BackTransResult.prototype);
        obj.__wbg_ptr = ptr;
        BackTransResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BackTransResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_backtransresult_free(ptr, 0);
    }
    /**
     * 点字セル範囲 → 文字列のセグメント列。各要素は `{ cellStart, cellEnd, text }`。
     * @returns {Array<any>}
     */
    get segments() {
        const ret = wasm.backtransresult_segments(this.__wbg_ptr);
        return ret;
    }
    /**
     * 復元された全文（`segments` のテキストを連結したものと一致する）。
     * @returns {string}
     */
    get text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.backtransresult_text(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) BackTransResult.prototype[Symbol.dispose] = BackTransResult.prototype.free;

/**
 * [`BrailleBackTranslator::step`] / [`BrailleBackTranslator::flush`] が引き継ぐ行内状態。
 *
 * 不透明なハンドル。JS 側は中身を参照せず、次回の `step`/`flush` にそのまま渡す。
 */
export class BackTransState {
    static __wrap(ptr) {
        const obj = Object.create(BackTransState.prototype);
        obj.__wbg_ptr = ptr;
        BackTransStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BackTransStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_backtransstate_free(ptr, 0);
    }
    /**
     * 保留セルが残っていない（行末で `flush` が不要）か。
     * @returns {boolean}
     */
    isSettled() {
        const ret = wasm.backtransstate_isSettled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * 初期状態（行頭）を生成する。
     */
    constructor() {
        const ret = wasm.backtransstate_new();
        this.__wbg_ptr = ret;
        BackTransStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) BackTransState.prototype[Symbol.dispose] = BackTransState.prototype.free;

/**
 * 点字をかな・記号・数字・ラテン文字に逆変換する。
 *
 * 順変換 [`BrailleTranslator`] と異なりモデル（.mbm）不要で、組み込みテーブルのみで動作する。
 *
 * ```js
 * const bt = new BrailleBackTranslator();
 * console.log(bt.backTranslate("⠁⠃⠉⠋⠊")); // アイウエオ
 * ```
 */
export class BrailleBackTranslator {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BrailleBackTranslatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_braillebacktranslator_free(ptr, 0);
    }
    /**
     * 点字セル列を逆変換し、復元文字列と点字セル範囲⇔文字列の対応を返す。
     *
     * エディタでの読みガイド表示など、点字セル位置と復元文字を対応付けたい用途向け。
     * @param {string} braille
     * @returns {BackTransResult}
     */
    backTranslateAligned(braille) {
        const ptr0 = passStringToWasm0(braille, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.braillebacktranslator_backTranslateAligned(this.__wbg_ptr, ptr0, len0);
        return BackTransResult.__wrap(ret);
    }
    /**
     * 点字セル列を文字列に逆変換して返す。
     * @param {string} braille
     * @returns {string}
     */
    backTranslate(braille) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(braille, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.braillebacktranslator_backTranslate(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * 行末で呼び、保留中のセル（結合待ちの前置セルなど）を確定させる。
     *
     * [`BackTransState::isSettled`] が `false` のまま行が終わる場合に呼ぶ。
     * @param {BackTransState} state
     * @returns {StepResult}
     */
    flush(state) {
        _assertClass(state, BackTransState);
        const ret = wasm.braillebacktranslator_flush(this.__wbg_ptr, state.__wbg_ptr);
        return StepResult.__wrap(ret);
    }
    /**
     * 組み込みテーブルからインスタンスを構築する。
     */
    constructor() {
        const ret = wasm.braillebacktranslator_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0];
        BrailleBackTranslatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * 点字 1 セルを逐次逆変換する（エディタでの逐次入力向け）。
     *
     * `cell` は点字 1 セル分の文字列（先頭の 1 文字のみ使用）。
     * 行頭では [`BackTransState::new`] の初期状態を渡し、以降は返り値の
     * [`StepResult::state`] を次回呼び出しに渡して、数符・外字符・濁音前置
     * などの行内状態を引き継ぐ。前置セル（濁音など）の直後は `text` が空になる
     * ことがある（次のセルと結合して確定するまで保留されるため）。
     * @param {string} cell
     * @param {BackTransState} state
     * @returns {StepResult}
     */
    step(cell, state) {
        const ptr0 = passStringToWasm0(cell, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(state, BackTransState);
        const ret = wasm.braillebacktranslator_step(this.__wbg_ptr, ptr0, len0, state.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StepResult.__wrap(ret[0]);
    }
}
if (Symbol.dispose) BrailleBackTranslator.prototype[Symbol.dispose] = BrailleBackTranslator.prototype.free;

/**
 * 点字変換結果。[`BrailleTranslator::translate`] 等の戻り値。
 */
export class BrailleResult {
    static __wrap(ptr) {
        const obj = Object.create(BrailleResult.prototype);
        obj.__wbg_ptr = ptr;
        BrailleResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BrailleResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_brailleresult_free(ptr, 0);
    }
    /**
     * 点字セルインデックス → テキスト文字インデックス。
     * @returns {Uint32Array}
     */
    get brailleToText() {
        const ret = wasm.brailleresult_brailleToText(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * 変換後の点字文字列。
     * @returns {string}
     */
    get braille() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.brailleresult_braille(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * 点訳した経路（`"japanese"` / `"english"`）。
     * @returns {string}
     */
    get language() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.brailleresult_language(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * テキスト文字インデックス → 点字先頭セルインデックス。
     * @returns {Uint32Array}
     */
    get textToBraille() {
        const ret = wasm.brailleresult_textToBraille(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * 点訳したテキスト（日本語=かな / 英語=英文）。
     * @returns {string}
     */
    get text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.brailleresult_text(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) BrailleResult.prototype[Symbol.dispose] = BrailleResult.prototype.free;

/**
 * 点訳器。読み（かな／英文）を点字に変換する。行の言語を判定して日本語／英語へ振り分ける。
 *
 * 入力は**読みに変換済みのテキスト**（日本語ならカナ）。漢字かな交じり文はまず
 * [`Predictor::predict`] でカナにしてから渡す。
 *
 * ```js
 * const t = new BrailleTranslator();
 * console.log(t.translate("ワガハイワネコデアル").braille);
 * console.log(t.translate("you should be here today").braille); // UEB grade 2
 * ```
 */
export class BrailleTranslator {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BrailleTranslatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_brailletranslator_free(ptr, 0);
    }
    /**
     * 組み込みテーブル（日本語１級 + UEB grade 2）で変換器を作る。
     */
    constructor() {
        const ret = wasm.brailletranslator_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0];
        BrailleTranslatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * 言語判定せず、必ず英語（UEB）として点訳する。
     * @param {string} text
     * @returns {BrailleResult}
     */
    translateEnglish(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.brailletranslator_translateEnglish(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BrailleResult.__wrap(ret[0]);
    }
    /**
     * 言語判定せず、必ず日本語として点訳する（英字は外字符 ⠰ ＋無縮約）。
     * @param {string} kana
     * @returns {BrailleResult}
     */
    translateJapanese(kana) {
        const ptr0 = passStringToWasm0(kana, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.brailletranslator_translateJapanese(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BrailleResult.__wrap(ret[0]);
    }
    /**
     * 1行を言語判定して点字に変換する（日本語=かな / 英語=UEB）。
     * @param {string} text
     * @returns {BrailleResult}
     */
    translate(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.brailletranslator_translate(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BrailleResult.__wrap(ret[0]);
    }
}
if (Symbol.dispose) BrailleTranslator.prototype[Symbol.dispose] = BrailleTranslator.prototype.free;

/**
 * 予測結果。[`Predictor::predict`] の戻り値。
 */
export class PredictionResult {
    static __wrap(ptr) {
        const obj = Object.create(PredictionResult.prototype);
        obj.__wbg_ptr = ptr;
        PredictionResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PredictionResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_predictionresult_free(ptr, 0);
    }
    /**
     * 各カナ文字の自信度（0.0〜1.0）。
     * @returns {Float32Array}
     */
    get confidences() {
        const ret = wasm.predictionresult_confidences(this.__wbg_ptr);
        var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * かな文字インデックス → 原文文字インデックス。
     * @returns {Uint32Array}
     */
    get kanaToSource() {
        const ret = wasm.predictionresult_kanaToSource(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * 変換後のカナ文字列。
     * @returns {string}
     */
    get kana() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.predictionresult_kana(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * 分かち書きされたカナ（`ワガハイ/ワ/ネコ/デ/アル` 形式）。
     * @returns {string}
     */
    get segmented() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.predictionresult_segmented(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * 分かち書きされた原文（`吾輩/は/猫/で/ある` 形式）。
     * @returns {string}
     */
    get sourceSegmented() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.predictionresult_sourceSegmented(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * 原文文字インデックス → かな文字インデックスの配列（配列の配列）。
     * @returns {Array<any>}
     */
    get sourceToKana() {
        const ret = wasm.predictionresult_sourceToKana(this.__wbg_ptr);
        return ret;
    }
    /**
     * 入力文字列（原文）。
     * @returns {string}
     */
    get source() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.predictionresult_source(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) PredictionResult.prototype[Symbol.dispose] = PredictionResult.prototype.free;

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
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PredictorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_predictor_free(ptr, 0);
    }
    /**
     * モデルバイト列 (.mbm) からインスタンスを構築する。
     * @param {Uint8Array} mbm_data
     */
    constructor(mbm_data) {
        const ptr0 = passArray8ToWasm0(mbm_data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.predictor_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0];
        PredictorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * テキストをカナに変換する。
     * @param {string} text
     * @returns {PredictionResult}
     */
    predict(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.predictor_predict(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PredictionResult.__wrap(ret[0]);
    }
}
if (Symbol.dispose) Predictor.prototype[Symbol.dispose] = Predictor.prototype.free;

/**
 * [`BrailleBackTranslator::step`] / [`BrailleBackTranslator::flush`] の結果。
 */
export class StepResult {
    static __wrap(ptr) {
        const obj = Object.create(StepResult.prototype);
        obj.__wbg_ptr = ptr;
        StepResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StepResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stepresult_free(ptr, 0);
    }
    /**
     * 更新後の状態。次の `step`/`flush` にそのまま渡す。
     * @returns {BackTransState}
     */
    get state() {
        const ret = wasm.stepresult_state(this.__wbg_ptr);
        return BackTransState.__wrap(ret);
    }
    /**
     * このセルで確定した文字列。前置セルの保留中は空、拗音などは 2 文字になりうる。
     * @returns {string}
     */
    get text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.stepresult_text(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) StepResult.prototype[Symbol.dispose] = StepResult.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_41e9ee4f547fc59a: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_new_617a8cdb8bb1130e: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_ee2291f50781bf1d: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_with_length_31d0d732d07f3195: function(arg0) {
            const ret = new Uint32Array(arg0 >>> 0);
            return ret;
        },
        __wbg_push_2baf45db356cf468: function(arg0, arg1) {
            const ret = arg0.push(arg1);
            return ret;
        },
        __wbg_set_145a351398b48c65: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_set_index_8255fcb5efcbdb24: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2 >>> 0;
        },
        __wbindgen_generic_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_generic_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./momors_wasm_bg.js": import0,
    };
}

const BackTransResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_backtransresult_free(ptr, 1));
const BackTransStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_backtransstate_free(ptr, 1));
const BrailleBackTranslatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_braillebacktranslator_free(ptr, 1));
const BrailleResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_brailleresult_free(ptr, 1));
const BrailleTranslatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_brailletranslator_free(ptr, 1));
const PredictionResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_predictionresult_free(ptr, 1));
const PredictorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_predictor_free(ptr, 1));
const StepResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_stepresult_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedFloat32ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('momors_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
