import { useState, useEffect, useRef } from 'react';
import { DynamicBrailleView } from './MomoBrailleList.tsx';
import init, { Predictor, BrailleTranslator } from 'momors_wasm';

export default function WasmClient() {
  const [input, setInput] = useState('今日はいい天気ですね');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState<{ original: string; kana: string; result: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // PredictorとBrailleTranslatorをrefで保持
  const predictorRef = useRef<Predictor | null>(null);
  const translatorRef = useRef<BrailleTranslator | null>(null);

  // 初回ロード時にWASMと辞書データを初期化
  useEffect(() => {
    let isMounted = true;

    async function loadWasmAndData() {
      try {
        // 1. WASMの初期化
        await init();

        // 2. public/data から辞書データをフェッチ
        const res = await fetch('/data/basic_data_7.mbm');
        if (!res.ok) throw new Error('辞書データの読み込みに失敗しました');

        const buffer = await res.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        if (isMounted) {
          // 初期化時にインスタンスを生成して保持
          predictorRef.current = new Predictor(bytes);
          translatorRef.current = new BrailleTranslator();
          setIsInitialized(true);
        }
      } catch (err) {
        if (isMounted) setError(`WASMの初期化に失敗しました: ${err}`);
      }
    }

    loadWasmAndData();

    // クリーンアップ関数
    return () => {
      isMounted = false;
      // アンロード（コンポーネントの破棄）時にWasmメモリを破棄
      predictorRef.current?.free();
      translatorRef.current?.free();
    };
  }, []);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized || !predictorRef.current || !translatorRef.current) {
      setError('WASMの準備がまだ完了していません');
      return;
    }

    setLoading(true);
    setError(null);

    let predResult = null;
    let brailleResult = null;

    try {
      // 毎回生成される結果オブジェクトは使い終わったら free() が必要。finallyに記載する
      predResult = predictorRef.current.predict(input);
      
      // predResult.segmented の区切り文字を置換
      // 例: "キョー/ワ/ /イ/イ/ /テン/キ/デ/ス/ネ" のような形式を想定
      const rawSegmented = predResult.segmented;
      
      // 文節の区切り（//）を半角スペースに、単語の区切り（/）を削除する
      const formattedKana = rawSegmented
        .replace(/\/\//g, ' ')  // 文節区切りを半角スペースに
        .replace(/\//g, '');    // 単語区切りを削除

      // 点訳器（BrailleTranslator）による点字変換
      // 点訳には分ち書きなしの kana、あるいは整形済みの文字列を使用
      const translator = new BrailleTranslator();
      brailleResult = translatorRef.current.translate(predResult.kana);

      setData({
        original: input,
        kana: formattedKana,
        result: brailleResult.braille,
      });
    } catch (err) {
      setError(`変換失敗: ${err}`);
    } finally {
      // 例外が起きても確実にメモリを解放する
      predResult?.free();
      brailleResult?.free();
      setLoading(false);
    }
  };

  return (
    <div className="test-section" style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
      <h2>2. テキストの指点字への変換</h2>
      <p style={{ paddingBottom: '0.5rem' }}>
        {isInitialized ? '準備完了' : '読み込み中...'}
      </p>

      <form onSubmit={handleConvert} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="変換するテキスト"
          style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          disabled={loading || !isInitialized}
          style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? '変換中...' : '変換する'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}

      {data && (
        <div style={{ padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
          <p><strong>原文:</strong> {data.original}</p>
          <p><strong>仮名:</strong> {data.kana}</p>
          <p><strong>点字:</strong> {data.result}</p>
          
          <div style={{ marginTop: '1rem' }}>
            <p><strong>指点字セル表示:</strong></p>
            <DynamicBrailleView kanaText={data.kana} />
          </div>
        </div>
      )}
    </div>
  );
}