import type { FC } from 'react';
import { useBrailleContext } from '../../contexts/BrailleContext'; 

const DebugOutput: FC = () => {
  const { currentMode, character, touchPressedKeys } = useBrailleContext();
  
  // useBrailleLogic の結果（pressedKeys）はContextに無いため、
  // BrailleApp のレンダリングロジックから取得する必要がある。
  // ここでは Context にある touchPressedKeys (タッチ専用) を表示する。
  
  const pressedKeysArray = Array.from(touchPressedKeys).join(', ');

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, right: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '8px',
      fontSize: '12px',
      zIndex: 9999,
      pointerEvents: 'none' // 画面操作を邪魔しないように
    }}>
      <p>Mode: {currentMode}</p>
      <p>Char: {character || 'None'}</p>
      <p>Touch Keys: {pressedKeysArray || '[]'}</p>
      <p>Touch Size: {touchPressedKeys.size}</p>
    </div>
  );
};

export default DebugOutput;