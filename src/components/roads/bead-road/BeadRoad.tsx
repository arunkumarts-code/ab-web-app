import { useMemo } from 'react'
import { updateDishRoad } from '@/components/roads/generate-road';
import RoadGrid from '../RoadGrid';
import { BeadRoadCell } from './BeadRoadCell';
import { GameResult } from '@/types';

const BeadRoad = ({ columns, data ,cellSize=32 }: { columns: number, data: GameResult[], cellSize?: number }) => {
   
   const beadRoadData = useMemo(() => {
      const bead = updateDishRoad(data);
      return bead
   }, [data]);

  return (
     <RoadGrid columns={columns} cellSize={cellSize} rows={6} dataLength={beadRoadData.length}>
      {beadRoadData.map((col: any, x: number) =>
         col.map((cell: any, y: number) =>
            cell ? (
            <div
               key={`${x}-${y}`}
               style={{
                  gridColumn: x + 1,
                  gridRow: y + 1,
                  marginRight: '-1px',
                  marginBottom: '-1px',
               }}
               className="flex items-center justify-center border-1 border-border"
            >
               <BeadRoadCell cell={cell} cellSize={cellSize} />
            </div>
            ) : null
         )
      )}
   </RoadGrid>
  )
}

export default BeadRoad