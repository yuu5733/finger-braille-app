import type { BrailleData } from '../../data/types';
import BrailleCell from '../BrailleTable/BrailleCell.tsx';
import styles from './MomoBrailleList.module.css';

export function DynamicBrailleView({ brailleCells }: { brailleCells: BrailleData[] }) {
  return (
    <ul className={styles.list}>
      {brailleCells.map((cellData, index) => (
        <BrailleCell key={index} {...cellData} />
      ))}
    </ul>
  );
}