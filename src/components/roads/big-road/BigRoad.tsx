import { useMemo } from 'react'
import { updateBigRoad } from '@/components/roads/generate-road';
import { BigRoadCell } from '@/components/roads/big-road/BigRoadCell';
import RoadGrid from '../RoadGrid';
import { GameResult } from '@/types';

const BigRoad = ({ columns, data, cellSize=32 }: { columns: number, data: GameResult[], cellSize?:number }) => {

   const bigRoadData = useMemo(() => {
      const big = updateBigRoad(data);
      return big.board
   }, [data]);
   
  return (
     <RoadGrid columns={columns} cellSize={cellSize} rows={6} dataLength={bigRoadData.length}>
      {bigRoadData.map((col: any, x: number) =>
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
               <BigRoadCell cell={cell} cellSize={cellSize} />
            </div>
            ) : null
         )
      )}
   </RoadGrid>
  )
}

export default BigRoad