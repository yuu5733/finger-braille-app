import { useState, useEffect } from 'react';
import { DynamicBrailleView } from './MomoBrailleList.tsx';
import init, { Predictor, BrailleTranslator } from 'momors_wasm';

export default function WasmClient() {
  const [input, setInput] = useState('今日はいい天気ですね');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [mbmBytes, setMbmBytes] = useState<Uint8Array | null>(null);
  const [data, setData] = useState<{ original: string; kana: string; result: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 初回ロード時にWASMと辞書データを初期化
  useEffect(() => {
    let isMounted = true;

    async function loadWasmAndData() {
      try {
        // 1. WASMの初期化
        await init();

        // 2. public/data から辞書データをフェッチ
        const res = await fetch('/data/basic_data_7.mbm');
        if (!res.ok) {
          throw new Error('辞書データの読み込みに失敗しました');
        }
        const buffer = await res.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        if (isMounted) {
          setMbmBytes(bytes);
          setIsInitialized(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(`WASMの初期化に失敗しました: ${err}`);
        }
      }
    }

    loadWasmAndData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized || !mbmBytes) {
      setError('WASMまたは辞書の準備がまだ完了していません');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 3. 予測器（Predictor）の準備とかな変換
      const predictor = new Predictor(mbmBytes);
      const predResult = predictor.predict(input);
      const kana = predResult.kana;

      // 4. 点訳器（BrailleTranslator）による点字変換
      const translator = new BrailleTranslator();
      const brailleResult = translator.translate(kana);

      setData({
        original: input,
        kana: predResult.segmented,
        result: brailleResult.braille,
      });
    } catch (err) {
      setError(`変換失敗: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-section" style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
      <h2>2. WASM変換</h2>
      <p style={{ paddingBottom: '0.5rem' }}>
        {isInitialized ? 'WASM 準備完了' : 'WASM 読み込み中...'}
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