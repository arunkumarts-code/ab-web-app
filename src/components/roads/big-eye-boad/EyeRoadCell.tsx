interface EyeRoadCellProps {
   cell: any;
   cellSize: number;
}

export function EyeRoadCell({ cell, cellSize }: EyeRoadCellProps) {
   if (!cell) return null;

   const color = cell === 1 ? "border-red-600" : "border-blue-600";
   const circleSize = cellSize * 0.4;

   return (
      <div
         className={` rounded-full border-2 ${color}`}
         style={{ width: circleSize, height: circleSize }}
      />
   );
}
