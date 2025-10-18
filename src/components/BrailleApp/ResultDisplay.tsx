import React from 'react';

import type { FC } from 'react';

import { dotsToHex } from '../../utils/dotsToHex';

import styles from './ResultDisplay.module.css';

interface ResultDisplayProps {
  text: string;
  brailleText: string;
  dots: number[];
}

const ResultDisplay: FC<ResultDisplayProps> = ({ text, brailleText, dots }) => {
  return (
    <div className={styles.resultDisplay}>
      <div>
        {/* ひらがなと点字を一行に表示 */}
        <p className={styles.resultTextGroup}> 
          <span className={styles.resultText}>{text}</span> 
          <span className={styles.resultBraille}>{brailleText}</span>
        </p>
        {/* 数字データをその下に表示 */}
        <p className={styles.resultDotsGroup}>
          <span className={styles.resultDots}>[{dots.length > 0 ? dots.join(', ') : '空白'}]</span>、
          <span className={styles.resultHex}>0x{dotsToHex(dots).toString(16).padStart(2, '0')}</span>
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay