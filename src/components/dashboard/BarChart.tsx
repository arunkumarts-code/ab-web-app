import React, { useEffect, useRef } from "react";

interface BarChartProps {
  data: { profit: number }[];
  height?: string;
  gap?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = "h-40",
  gap = "gap-1",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [data]);

  if (!data || data.length === 0) return null;

  const profits = data.map((d) => d.profit);

  const maxProfit = Math.max(...profits);
  const minProfit = Math.min(...profits);
  const maxAbs = Math.max(Math.abs(maxProfit), Math.abs(minProfit)) || 1;

  const getColorClass = (profit: number): string => {
    if (profit === 0) return "bg-gray-300 dark:bg-gray-700";

    const intensity = Math.abs(profit) / maxAbs;

    if (profit > 0) {
      if (intensity > 0.75) return "bg-green-600 dark:bg-green-500";
      if (intensity > 0.5) return "bg-green-500 dark:bg-green-600";
      if (intensity > 0.25) return "bg-green-400 dark:bg-green-700";
      return "bg-green-300 dark:bg-green-800";
    }

    if (intensity > 0.75) return "bg-red-600 dark:bg-red-500";
    if (intensity > 0.5) return "bg-red-500 dark:bg-red-600";
    if (intensity > 0.25) return "bg-red-400 dark:bg-red-700";
    return "bg-red-300 dark:bg-red-800";
  };

  const getHeight = (profit: number): number => {
    const percentage = (Math.abs(profit) / maxAbs) * 100;
    return Math.max(10, percentage);
  };

  return (
    <div className="mt-4 w-full flex flex-col px-1">
      <div
        ref={scrollRef}
        className="w-full flex flex-col items-center overflow-x-auto hideScrollbar-custom"
      >
        <div
          className={`flex items-end ${height} px-2 pb-1 ${gap} min-w-max`}
        >
          {data.map((item, index) => (
            <div
              key={index}
              className={` rounded-xs ${getColorClass(
                item.profit
              )} 
              w-8 sm:w-10 md:w-12 lg:w-16 xl:w-20
              min-w-8 sm:min-w-10 md:min-w-12 lg:min-w-16 xl:min-w-20
              max-w-8 sm:max-w-10 md:max-w-12 lg:max-w-16 xl:max-w-20`}
              style={{ height: `${getHeight(item.profit)}%` }}
            />
          ))}
        </div>

        <div className={`flex px-2 ${gap} mt-2 min-w-max`}>
          {data.map((item, index) => (
            <div
              key={`label-${index}`}
              className={` text-center font-medium
              ${item.profit < 0
                    ? "text-red-500 dark:text-red-400"
                    : item.profit > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
              w-8 sm:w-10 md:w-12 lg:w-16 xl:w-20
              min-w-8 sm:min-w-10 md:min-w-12 lg:min-w-16 xl:min-w-20
              max-w-8 sm:max-w-10 md:max-w-12 lg:max-w-16 xl:max-w-20
              text-[10px] sm:text-xs md:text-sm lg:text-base`}
            >
              {item.profit > 0 ? "+" : ""}
              {item.profit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
