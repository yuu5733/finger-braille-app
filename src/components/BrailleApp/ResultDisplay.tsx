import type { FC } from 'react';
import type { BrailleChar, BrailleCode } from '../../data/types';
import { dotsToHex } from '../../utils/dotsToHex';
import styles from './ResultDisplay.module.css';

interface ResultDisplayProps {
  text: string;
  brailleChar: BrailleChar;
  dots: BrailleCode;
  className?: string;
}

const ResultDisplay: FC<ResultDisplayProps> = ({
  text,
  brailleChar,
  dots,
  className,
}) => {
  const displayText = text ? text : '␣';
  const displayBraille = brailleChar ? brailleChar : '⠀';

  return (
    <div className={`${styles.resultDisplay} ${className || ''}`}>
      <div>
        {/* ひらがなと点字を一行に表示 */}
        <p className={styles.resultTextGroup}>
          <span className={styles.resultText}>{displayText}</span>
          <span className={styles.resultBraille}>{displayBraille}</span>
        </p>
        {/* 数字データをその下に表示 */}
        <p className={styles.resultDotsGroup}>
          <span className={styles.resultDots}>
            [{dots.length > 0 ? dots.join(', ') : '空白'}]
          </span>
          、
          <span className={styles.resultHex}>
            0x{dotsToHex(dots).toString(16).padStart(2, '0')}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;
