import { useState, useEffect } from 'react';
import { DynamicBrailleView } from './momo-api.tsx';
// wasm-packで生成されたモジュールをインポート
import init, { /* 必要な関数名（例: convert_text 等） */ } from 'momors_wasm';

export default function ApiTestClient() {
  const [input, setInput] = useState('今日はいい天気ですね');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState<{ original: string; kana: string; result: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 初回ロード時にWASMと辞書データを初期化
  useEffect(() => {
    let isMounted = true;

    async function loadWasm() {
      try {
        // 1. WASMの初期化（WASMバイナリのロード）
        await init();

        // 2. 必要に応じてpublic/dataから辞書データをフェッチしてWASM側に渡す処理
        // ※ momors_wasm の仕様（バインド定義）に合わせて記述してください
        // 例: const res = await fetch('/data/basic_data_7.mbm');
        // const buffer = await res.arrayBuffer();
        // 辞書登録関数(new Uint8Array(buffer));

        if (isMounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(`WASMの初期化に失敗しました: ${err}`);
        }
      }
    }

    loadWasm();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized) {
      setError('WASMの初期化がまだ完了していません');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 3. 外部APIのfetchの代わりにWASMの関数を直接呼び出す
      // const convertedResult = convert_text(input); // momors_wasmのエクスポート関数

      // 仮の処理（WASMの関数名・戻り値構造に合わせて置き換えてください）
      const kanaResult = input; // 仮
      const brailleResult = "⠀"; // 仮

      setData({
        original: input,
        kana: kanaResult,
        result: brailleResult,
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