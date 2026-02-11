import { useMemo } from 'react'
import { toRoadQuadData, updateEyeRoad } from '@/components/roads/generate-road';
import RoadGrid from '../RoadGrid';
import { RoachRoadCell } from './RoachRoadCell';
import { GameResult } from '@/types';

const RoachRoad = ({ columns, data, cellSize = 32 }: { columns: number, data: GameResult[], cellSize?: number }) => {

   const roachRoadData = useMemo(() => {
      const roach = updateEyeRoad(data, 4);
      const roachRoadData = toRoadQuadData(roach.board);

      return roachRoadData
   }, [data]);

  return (
     <RoadGrid columns={columns} cellSize={cellSize} rows={3} dataLength={roachRoadData.length}>
        {roachRoadData.map((col: any, x: number) =>
         col.map((cell: any, y: number) => (
            <div
               key={`${x}-${y}`}
               style={{
                  gridColumn: x + 1,
                  gridRow: y + 1,
                  marginRight: '-1px',
                  marginBottom: '-1px',
               }}
               className="flex items-center justify-center border border-border"
            >
               <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                  {cell.map((v: any, i: any) =>
                     v !== null ? (
                        <div key={`${x}-${y}-${i}`} className="flex justify-center items-center">
                           <RoachRoadCell key={i} cell={v} size={10} />
                        </div>
                     ) : (
                        <div key={`${x}-${y}-${i}`} />
                     )
                  )}
               </div>
            </div>
         ))
      )}
   </RoadGrid>
  )
}

export default RoachRoad