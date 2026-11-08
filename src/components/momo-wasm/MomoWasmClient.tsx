import { useState, useEffect, useRef } from 'react';
import { DynamicBrailleView } from './MomoBrailleList.tsx';
import init, { Predictor, BrailleTranslator } from 'momors_wasm';
import { parseTextToBrailleCells } from '../../utils/wasmParser';
import type { BrailleData } from '../../data/types';
import styles from './MomoWasmClient.module.css';

export default function WasmClient() {
  const [input, setInput] = useState('今日は、いい天気ですね');
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  // テキストエリアの高さを自動調整する関数
  const handleInputResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleInputResize();
  }, [input]);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized || !predictorRef.current) {
      setError('WASMの準備がまだ完了していません');
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
    <div className={styles.testSection}>
      <h2>2. テキストの指点字への変換</h2>
      <p className={styles.statusText}>
        {isInitialized ? 'ライブラリ「MOMO」の準備が完了しました' : 'ライブラリ「MOMO」の読み込み中...'}
      </p>

      <form onSubmit={handleConvert} className={styles.form}>
        <label htmlFor="source-text" className={styles.label}>
          変換するテキスト
          <textarea
            ref={textareaRef}
            id="source-text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleInputResize();
            }}
            placeholder="変換するテキスト"
            className={styles.textarea}
            rows={3}
          />
        </label>
        <button 
          type="submit" 
          id="convert-btn"
          disabled={loading || !isInitialized}
          className={`${styles.convertBtn} btn-primary`}
        >
          {loading ? '変換中...' : '変換'}
        </button>
      </form>

      {error && <p className={styles.errorText}>エラー: {error}</p>}

      {data && (
        <div className={styles.resultContainer}>
          <p><strong>原文:</strong> {data.original}</p>
          <p><strong>仮名:</strong> {data.kana}</p>
          
          <div className={styles.cellsWrapper}>
            <p><strong>点字セル表示:</strong></p>
            
            <ul className={styles.cellsList}>
              {data.brailleCells.map((cellData, index) => {
                const brailleStr = cellData.subCells 
                  ? cellData.subCells.map(sc => sc.brailleChar).join('') 
                  : (cellData.brailleChar || '');

                return (
                  <li key={index} className={styles.cellItem}>
                    <span className={styles.cellCharacter}>
                      {cellData.character}
                    </span>
                    <span className={styles.cellBraille}>
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