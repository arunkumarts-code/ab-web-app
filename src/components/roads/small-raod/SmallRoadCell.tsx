interface EyeRoadCellProps {
   cell: any;
   cellSize: number;
}

export function SmallRoadCell({ cell, cellSize }: EyeRoadCellProps) {
   
   if (!cell) return null;

   const bgColor = cell === 1 ? "bg-red-600" : "bg-blue-600";
   const circleSize = cellSize * 0.4;

   return (
      <div
         className={` rounded-full ${bgColor}`}
         style={{ width: circleSize, height: circleSize }}
      />
   );
}
