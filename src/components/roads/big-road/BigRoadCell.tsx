interface BigRoadCellProps {
   cell: any;
   cellSize: number;
}

export function BigRoadCell({ cell, cellSize }: BigRoadCellProps) {
   if (!cell) return null;

   const color =
      cell.resultType === 1
         ? "border-red-600"
         : cell.resultType === 2
            ? "border-blue-600"
            : "border-transparent";

   const circleSize = cellSize * 0.8;

   const fontSize = Math.max(9, Math.floor(circleSize * 0.6));

   return (
      <div
         className={`rounded-full border-2 ${color} flex items-center justify-center`}
         style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
         }}
      >
         {cell.drawCounter > 0 && (
            <span className="font-bold" style={{ fontSize: `${fontSize}px` }}>
               {cell.drawCounter}
            </span>
         )}
      </div>
   );
}
