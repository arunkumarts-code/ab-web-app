interface RoachRoadCellProps {
   cell: any;
   size: number;
}

export function RoachRoadCell({ cell, size }: RoachRoadCellProps) {
   if (!cell) return null;

   const color = cell === 1 ? "bg-red-600" : "bg-blue-600";

   return (
      <div
         className=" rounded-full flex items-center justify-center"
         style={{ width: size, height: size }}
      >
         <div
            className={`${color} w-[3px] h-full`}
            style={{ transform: "rotate(45deg)" }}
         />
      </div>
   );
}
