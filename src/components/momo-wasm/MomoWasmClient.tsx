import { useState, useEffect, useRef } from 'react';
import { DynamicBrailleView } from './MomoBrailleList.tsx';
import init, { Predictor, BrailleTranslator } from 'momors_wasm';
import { parseTextToBrailleCells } from '../../utils/wasmParser';
import type { BrailleData } from '../../data/types';

export default function WasmClient() {
  const [input, setInput] = useState('今日は、いい天気ですね');
  // const [input, setInput] = useState('LiD/APD（聴覚情報処理障害）という言葉もあります');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState<{ 
    original: string; 
    kana: string; 
    brailleCells: BrailleData[]; 
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predictorRef = useRef<Predictor | null>(null);
  const translatorRef = useRef<BrailleTranslator | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWasmAndData() {
      try {
        await init();
        const res = await fetch('/data/basic_data_7.mbm');
        if (!res.ok) throw new Error('辞書データの読み込みに失敗しました');

        const buffer = await res.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        if (isMounted) {
          predictorRef.current = new Predictor(bytes);
          translatorRef.current = new BrailleTranslator();
          setIsInitialized(true);
        }
      } catch (err) {
        if (isMounted) setError(`WASMの初期化に失敗しました: ${err}`);
      }
    }

    loadWasmAndData();

    return () => {
      isMounted = false;
      predictorRef.current?.free();
      translatorRef.current?.free();
    };
  }, []);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized || !predictorRef.current) {
      setError('WASMの準備がまだ完了していません');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // アルファベットを小文字にしてwasmに渡す
      const normalizedInput = input.toLowerCase();

      const conversionResult = parseTextToBrailleCells(
        predictorRef.current,
        normalizedInput
      );

      setData({
        original: input,
        kana: conversionResult.kana,
        brailleCells: conversionResult.brailleCells,
      });
    } catch (err) {
      setError(`変換失敗: ${err}`);
    } finally {
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
          style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '64px' }}
        >
          {loading ? '変換中...' : '変換'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}

      {data && (
        <div style={{ padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
          <p><strong>原文:</strong> {data.original}</p>
          <p><strong>仮名:</strong> {data.kana}</p>
          
          <div style={{ marginTop: '1rem' }}>
            <p><strong>点字セル表示:</strong></p>
            
            {/* セットで折り返すためのコンテナ */}
            <ul style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem', 
              listStyle: 'none', 
              padding: 0, 
              margin: '0.5rem 0 0 0' 
            }}>
              {data.brailleCells.map((cellData, index) => {
                // 点字文字列の取得（subCells または braille プロパティから安全に取得）
                const brailleStr = cellData.subCells 
                  ? cellData.subCells.map(sc => sc.braille).join('') 
                  : (cellData.braille || '');

                return (
                  <li 
                    key={index} 
                    style={{ 
                      display: 'inline-flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      padding: '0.3rem 0.5rem', 
                      background: '#f4f4f4', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px',
                      minWidth: '2rem'
                    }}
                  >
                    {/* 仮名 */}
                    <span style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      {cellData.character}
                    </span>
                    {/* 点字 */}
                    <span style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>
                      {brailleStr || '⠀'}
                    </span>
                  </li>
                );
              })}
            </ul>
            <DynamicBrailleView brailleCells={data.brailleCells} />
          </div>
        </div>
      )}
    </div>
  );
}