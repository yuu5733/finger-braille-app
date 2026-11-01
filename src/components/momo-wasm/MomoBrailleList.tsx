import type { BrailleData } from '../../data/types';
import BrailleCell from '../BrailleTable/BrailleCell.tsx';

export function DynamicBrailleView({ brailleCells }: { brailleCells: BrailleData[] }) {
  return (
    <ul className="" style={{ margin: "1rem auto", maxWidth: "550px", borderTop: "2px solid #333", borderLeft: "2px solid #333"}}>
      {brailleCells.map((cellData, index) => (
        <BrailleCell key={index} {...cellData} />
      ))}
    </ul>
  );
}