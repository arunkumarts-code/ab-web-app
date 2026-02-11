import React from 'react';

interface BarChartProps {
  data: Array<{ game: number; profite: number }>;
  height?: string;
  gap?: string;
  barWidth?: string;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  height = "h-10",
  gap = "gap-1",
  barWidth = "w-20"
}) => {
  // Find min and max for scaling
  const profits = data.map(d => d.profite);
  const maxProfit = Math.max(...profits);
  const minProfit = Math.min(...profits);
  const range = maxProfit - minProfit;

  // Function to get color intensity
  const getColorClass = (profit: number): string => {
    if (profit < 0) {
      return 'bg-red-400 dark:bg-red-400';
    }
    
    // Normalize profit to 0-1 range
    const normalized = (profit - Math.max(0, minProfit)) / (maxProfit - Math.max(0, minProfit));
    
    // Map to Tailwind color scale (200-500 for green)
    if (normalized > 0.75) return 'bg-green-600 dark:bg-green-600';
    if (normalized > 0.5) return 'bg-green-500 dark:bg-green-700';
    if (normalized > 0.25) return 'bg-green-400 dark:bg-green-800';
    return 'bg-green-300 dark:bg-green-900';
  };

  // Function to get height percentage
  const getHeight = (profit: number): number => {
    // Normalize to 0-1 range (accounting for negative values)
    const normalized = (profit - minProfit) / range;
    // Convert to percentage (minimum 20%, maximum 100%)
    return Math.max(20, normalized * 100);
  };

  return (
    <div className="mt-4 w-full ">
      <div className={`${height} rounded flex items-end px-2 pb-1 ${gap}`}>
        {data.map((item) => (
          <div
            key={item.game}
            className={`${barWidth} rounded-sm ${getColorClass(item.profite)}`}
            style={{ height: `${getHeight(item.profite)}%` }}
          />
        ))}
      </div>
      
      {/* Labels */}
      <div className={`flex px-2 ${gap} mt-1`}>
        {data.map((item) => (
          <div
            key={`label-${item.game}`}
            className={`${barWidth} text-center text-xs ${
              item.profite < 0 
                ? 'text-red-500 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            {item.profite > 0 ? '+' : ''}{item.profite}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;