interface RoachRoadCellProps {
   cell: any;
   cellSize: number;
}

export function RoachRoadCell({ cell, cellSize }: RoachRoadCellProps) {
   if (!cell) return null;

   const color = cell === 1 ? "bg-red-600" : "bg-blue-600";
   const circleSize = cellSize * 0.4;

   return (
      <div
         className=" rounded-full flex items-center justify-center"
         style={{ width: circleSize, height: circleSize }}
      >
         <div
            className={`${color} w-[3px] h-full`}
            style={{ transform: "rotate(45deg)" }}
         />
      </div>
   );
}
