interface BigRoadCellProps {
   cell: any;
   size: number;
}

export function BigRoadCell({ cell, size }: BigRoadCellProps) {
   if (!cell) return null;

   const color =
      cell.resultType === 1
         ? "border-red-600"
         : cell.resultType === 2
            ? "border-blue-600"
            : "border-transparent";

   return (
      <div
         className={`rounded-full border-2 ${color} flex items-center justify-center`}
         style={{
            width: `${size}px`,
            height: `${size}px`,
         }}
      >
         {cell.drawCounter > 0 && (
            <span className="text-xs font-bold">
               {cell.drawCounter}
            </span>
         )}
      </div>
   );
}
