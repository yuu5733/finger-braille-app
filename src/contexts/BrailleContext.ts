import { createContext, useContext } from 'react';

import type { BrailleData, InputMode, BrailleDot } from '../data/types';
import type { Dispatch, SetStateAction } from 'react';

// Context が提供する値の型を定義
export interface BrailleContextType {
  currentMode: InputMode;
  setCurrentMode: Dispatch<SetStateAction<InputMode>>;
  
  // const [value, setValue] = useState<T>(initialValue);
  // setValue の型が、 React.Dispatch<React.SetStateAction<T>>
  // voidなどにしてしまうと、Context 経由で State 更新ができない
  pendingData: BrailleData | null;
  setPendingData: Dispatch<SetStateAction<BrailleData | null>>;
  
  onOutput: (char: string) => void;             // 確定文字の出力
  onDisplayUpdate: (data: BrailleData) => void; // 表示の更新

  character: string;      // ResultDisplay用
  braille: string;        // ResultDisplay用
  dots: BrailleDot[];         // ResultDisplay用
  outputString: string;   // 確定文字列用

  // useTouchListenerの結果
  touchPressedKeys: Set<string>; // タッチ専用のpressedKeys
  handlePressChange: (key: string, isPressed: boolean) => void;
}

// 初期値を null に設定（Provider の使用を必須とする）
export const BrailleContext = createContext<BrailleContextType | null>(null);

// カスタムフックとしてラップし、使いやすくする
// 1. useContextを各コンポーネントで使用しなくて済む（Context 値の取得をカプセル化する）
// 2. Provider の使用必須化がチェックできる
export const useBrailleContext = () => {
  const context = useContext(BrailleContext);
  if (!context) {
    throw new Error('useBrailleContext は BrailleProvider の内部でのみ使用可能です');
  }
  return context;
};