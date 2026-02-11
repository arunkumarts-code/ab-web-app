interface EyeRoadCellProps {
   cell: any;
   size: number;
}

export function SmallRoadCell({ cell, size }: EyeRoadCellProps) {
   
   if (!cell) return null;

   const bgColor = cell === 1 ? "bg-red-600" : "bg-blue-600";

   return (
      <div
         className={` rounded-full ${bgColor}`}
         style={{ width: size, height: size }}
      />
   );
}
