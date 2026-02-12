import React, { useEffect, useRef } from "react";

interface BarChartProps {
  data: Array<{ game: number; profite: number }>;
  height?: string;
  gap?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = "h-40",
  gap = "gap-1",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) return null;

  const profits = data.map((d) => d.profite);

  const maxProfit = Math.max(...profits);
  const minProfit = Math.min(...profits);
  const maxAbs = Math.max(Math.abs(maxProfit), Math.abs(minProfit)) || 1;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [data]);

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
          {data.map((item) => (
            <div
              key={item.game}
              className={`min-w-10 max-w-15 rounded-xs ${getColorClass(
                item.profite
              )}`}
              style={{ height: `${getHeight(item.profite)}%` }}
            />
          ))}
        </div>

        <div
          className={`flex px-2 ${gap} mt-2 min-w-max`}
        >
          {data.map((item) => (
            <div
              key={`label-${item.game}`}
              className={`min-w-10 max-w-15 text-center text-xs font-medium ${item.profite < 0
                  ? "text-red-500 dark:text-red-400"
                  : item.profite > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
            >
              {item.profite > 0 ? "+" : ""}
              {item.profite}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
