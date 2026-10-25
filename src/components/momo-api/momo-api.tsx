import { parseHiraganaToBrailleCells } from '../../utils/parseTextToBraille.ts';
import BrailleCell from '../BrailleTable/BrailleCell.tsx';

export function DynamicBrailleView({ kanaText }: { kanaText: string }) {
  const brailleCells = parseHiraganaToBrailleCells(kanaText);

  return (
    <ul className="flex flex-wrap gap-2 p-4">
      {brailleCells.map((cellData, index) => (
        <BrailleCell key={index} {...cellData} />
      ))}
    </ul>
  );
}