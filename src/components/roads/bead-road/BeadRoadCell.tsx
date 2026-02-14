interface BeadRoadCellProps {
   cell: any;
   cellSize: number;
}

export function BeadRoadCell({ cell, cellSize }: BeadRoadCellProps) {
   if (!cell) return null;

   const bgColor =
      cell === 1
         ? "bg-red-600"
         : cell === 2
            ? "bg-blue-600"
            : "bg-green-500";
            
   const circleSize = cellSize * 0.8;

   return (
      <div className={` rounded-full border-box flex justify-center items-center ${bgColor} `} 
         style={{ width: circleSize, height: circleSize }}
      > 
         <div className="border-2 border-surface rounded-full " 
            style={{ width: circleSize * 0.9, height: circleSize * 0.9 }}
         ></div>
      </div>
   );
}
