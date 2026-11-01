import { Predictor, BrailleTranslator } from '../../pkg/momors_wasm';
import type { AlignedItem } from '../data/types';

export function parseTextToAlignedArray(
  predictor: Predictor,
  translator: BrailleTranslator,
  input: string
): { kana: string; result: string; aligned: AlignedItem[] } {
  const predResult = predictor.predict(input);
  try {
    const brailleResult = translator.translate(predResult.kana);
    try {
      const sourceChars = Array.from(predResult.source);
      const kanaChars = Array.from(predResult.kana);
      const sourceToKana = predResult.sourceToKana;
      const textToBraille = brailleResult.textToBraille;
      const brailleCells = Array.from(brailleResult.braille);

      const aligned: AlignedItem[] = sourceChars.map((srcChar, i) => {
        const kanaIndices = Array.from(sourceToKana[i] || []);
        const subKanaChars = kanaIndices.map((k) => kanaChars[k] ?? '');
        const kanaText = subKanaChars.join('');

        let brailleText = '';
        if (kanaIndices.length > 0) {
          const firstKanaIdx = kanaIndices[0];
          const lastKanaIdx = kanaIndices[kanaIndices.length - 1];
          
          const startCell = textToBraille[firstKanaIdx];
          const endCell = lastKanaIdx + 1 < textToBraille.length 
            ? textToBraille[lastKanaIdx + 1] 
            : brailleCells.length;

          if (startCell !== undefined && endCell !== undefined) {
            brailleText = brailleCells.slice(startCell, endCell).join('');
          }
        }

        return {
          sourceIndex: i,
          sourceChar: srcChar,
          kanaIndices,
          kanaChars: subKanaChars,
          kanaText,
          brailleText,
        };
      });

      return {
        kana: predResult.kana,
        result: brailleResult.braille,
        aligned,
      };
    } finally {
      brailleResult.free();
    }
  } finally {
    predResult.free();
  }
}