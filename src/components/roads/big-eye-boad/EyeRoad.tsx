import { useMemo } from 'react'
import { toRoadQuadData, updateEyeRoad } from '@/components/roads/generate-road';
import RoadGrid from '../RoadGrid';
import { EyeRoadCell } from './EyeRoadCell';
import { GameResult } from '@/types';

const EyeRoad = ({ columns, data, cellSize=32 }: { columns: number, data: GameResult[], cellSize?:number }) => {
   const eyeRoadData = useMemo(() => {
      const eye = updateEyeRoad(data, 1);
      const eyeRoadData = toRoadQuadData(eye.board);
      return eyeRoadData
   }, [data]);

  return (
     <RoadGrid columns={columns} cellSize={cellSize} rows={3} dataLength={eyeRoadData.length}>
        {eyeRoadData.map((col: any, x: number) =>
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
                           <EyeRoadCell cell={v} size={10} />
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

export default EyeRoad