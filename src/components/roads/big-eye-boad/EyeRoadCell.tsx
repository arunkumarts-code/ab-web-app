interface EyeRoadCellProps {
   cell: any;
   size: number;
}

export function EyeRoadCell({ cell, size }: EyeRoadCellProps) {
   if (!cell) return null;

   const color = cell === 1 ? "border-red-600" : "border-blue-600";

   return (
      <div
         className={` rounded-full border-2 ${color}`}
         style={{ width: size, height: size }}
      />
   );
}
