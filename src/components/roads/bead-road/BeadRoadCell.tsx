interface BeadRoadCellProps {
   cell: any;
   size: number;
}

export function BeadRoadCell({ cell, size }: BeadRoadCellProps) {
   if (!cell) return null;

   const bgColor =
      cell === 1
         ? "bg-red-600"
         : cell === 2
            ? "bg-blue-600"
            : "bg-green-500";

   return (
      <div className={` rounded-full border-box flex justify-center items-center ${bgColor} `} 
         style={{ width: size, height: size }}
      > 
         <div className="border-2 border-surface rounded-full " 
            style={{ width: size-2, height: size-2 }}
         ></div>
      </div>
   );
}
