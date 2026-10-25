import { useState } from 'react';
import { DynamicBrailleView } from './api-test.tsx';

export default function ApiTestClient() {
  const [input, setInput] = useState('今日はいい天気ですね');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ original: string; kana: string; result: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/momo-convert-braille?text=${encodeURIComponent(input)}`);
      const json = await res.json();

      if (res.ok) {
        setData(json);
      } else {
        setError(json.error || '不明なエラー');
      }
    } catch (err) {
      setError(`通信失敗: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-section" style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
      <h2>2. API通信・変換テスト（React）</h2>
      <p>テキストを入力し、変換処理の動作を確認します。</p>

      <form onSubmit={handleConvert} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="変換するテキスト（例：あいうえお）"
          style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? '変換中...' : '変換テスト'}
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