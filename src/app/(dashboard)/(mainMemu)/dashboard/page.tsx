"use client";

import GlobalLoader from "@/components/common/GlobalLoader";
import GameProfitBars from "@/components/dashboard/BarChart";
import { getLiveWins, getProfitGraphData, getTop10Players } from "@/services/dashboard.service";
import { JSX, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaChartLine, FaMedal, FaTrophy } from "react-icons/fa6";

const PERIODS = ["Day", "Week", "Month", "Quarter", "Year"];

interface TopPlayer {
  rank: number;
  player: string;
  winRate: string;
  totalTrades: number;
  profit: number;
}
interface ProfitSummary {
  currentProfit: number;
  previousProfit: number;
}

interface LiveWin {
  name: string;
  avatar: string | null;
  time: string;
  amount: number;
}

const rankConfig: Record<
  number,
  {
    bg: string;
    icon: JSX.Element;
  }
> = {
  1: {
    bg: "bg-yellow-50/50 dark:bg-yellow-900/10",
    icon: <FaTrophy className="text-yellow-500 dark:text-yellow-400 text-sm md:text-base" />,
  },
  2: {
    bg: "bg-gray-50/50 dark:bg-gray-800/20",
    icon: <FaMedal className="text-gray-400 dark:text-gray-300 text-sm md:text-base" />,
  },
  3: {
    bg: "bg-orange-50/50 dark:bg-orange-900/10",
    icon: <FaMedal className="text-orange-400 dark:text-orange-300 text-sm md:text-base" />,
  },
};

const DashboardPage = () => {
  const [activePeriod, setActivePeriod] = useState("Day");
  const [loadingData, setLoadingData] = useState(false);
  const [gameProfitData, setGameProfitData] = useState<{ profit: number }[]>([]);
  const [top10Players, setTop10Players] = useState<TopPlayer[]>([]);
  const [liveWins, setLiveWins] = useState<LiveWin[]>([]);
  const [profitSummary, setProfitSummary] =
    useState<ProfitSummary>({
      currentProfit: 0,
      previousProfit: 0,
    });

  let percentage = 0;
  const { currentProfit, previousProfit } = profitSummary;

  if (currentProfit === 0) {
    percentage = previousProfit === 0 ? 0 : -100;
  } else {
    percentage = (previousProfit / currentProfit) * 100;
  }
  if (previousProfit === 0) {
    if (currentProfit > 0) {
      percentage = 100; 
    } else if (currentProfit < 0) {
      percentage = -100; 
    } else {
      percentage = 0; 
    }
  } else {
    percentage =
      ((currentProfit - previousProfit) / Math.abs(previousProfit)) * 100;
  }

  const isPositive = percentage >= 0;

  useEffect(() => {
    const init = async () => {
      try {
        setLoadingData(true);
        const top10Data = await getTop10Players(activePeriod.toLowerCase());
        setTop10Players(top10Data || []);

        const response = await getProfitGraphData(
          activePeriod.toLowerCase()
        );
        setGameProfitData(response.data);
        setProfitSummary(response.profitSummary);

      } finally {
        setLoadingData(false);
      }
    };

    init();
  }, [activePeriod]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLiveWins();
      setLiveWins(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
    {loadingData && <GlobalLoader />}

    <div className="flex flex-col space-y-5 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Title */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">Performance Stats</h1>
          <p className="text-sm text-muted">Track your daily progress and global rankings.
          </p>
        </div>
        {/* Period buttons */}
        <div
          className="
            bg-primary-foreground border border-border
            p-1 rounded-lg shadow-sm border-border
            flex overflow-x-auto max-w-full
          "
        >
          {PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`whitespace-nowrap px-4 py-2 text-sm text-muted font-medium rounded-md transition
              ${activePeriod === period
                ? "bg-primary text-white"
                : "hover:bg-surface hover:text-primary"}
              `}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div>
        {/* Net Profit Card */}
        <div className="transition-colors bg-surface p-6 rounded-xl shadow-sm border border-border lg:col-span-2">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted">
                Net Profit {activePeriod}
              </p>
              <div className="flex items-baseline gap-3 mt-2">
                <h2
                  className={`text-2xl font-bold ${profitSummary.currentProfit >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {profitSummary.currentProfit >= 0 ? "+" : "-"}
                  {Math.abs(profitSummary.currentProfit).toFixed(2)}
                </h2>

                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1
                  ${isPositive
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                >
                  {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(percentage).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-lg">
              <FaChartLine className="text-md" />
            </div>
          </div>

          {/* Mini Bar Chart */}
          <GameProfitBars 
            data={gameProfitData} 
            height="h-20"
            gap="gap-2"
          />
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div
          className="card-transition xl:col-span-1 bg-surface rounded-xl shadow-sm border border-border flex flex-col min-h-100">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-md">Live Wins</h3>
            <span
              className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-1 rounded font-bold animate-pulse">LIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {liveWins.map((win, index) => {
              let opacityClass = "opacity-100";

              if (index >= 3 && index < 4) opacityClass = "opacity-75";
              else if (index >= 4 && index < 5) opacityClass = "opacity-60";
              else if (index >= 5) opacityClass = "opacity-50";

              return (
                <div
                  key={`${win.name}-${win.time}-${win.amount}`}
                  className={`flex items-center justify-between p-3 rounded-lg 
                  hover:bg-gray-100 dark:hover:bg-gray-800 
                  transition ${opacityClass}`}
                >
                  <div className="flex items-center gap-3">
                    {win.avatar ? (
                      <img
                        src={win.avatar}
                        alt={win.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-500 
                        flex items-center justify-center 
                        text-white text-xs font-bold">
                        U
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold">{win.name}</p>
                      <p className="text-xs text-gray-500">{win.time}</p>
                    </div>
                  </div>

                  <span className="text-green-500 font-bold text-sm">
                    +${win.amount.toLocaleString()}
                  </span>
                </div>
              )})}
          </div>
        </div>

        <div
          className="card-transition xl:col-span-3 bg-surface rounded-xl shadow-sm border border-border min-h-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-md">Top 10 Players</h3>
              <p className="text-sm text-muted">Rankings based on highest profit for the selected period.
              </p>
            </div>
          </div>

          <div className="overflow-auto flex-1 p-0 scrollbar-custom">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10"> 
                <tr> 
                  <th className="px-3 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"> 
                    Rank</th> 
                  <th className="px-3 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"> 
                    Player</th> 
                  <th className="px-3 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"> 
                    Win Rate</th> 
                  <th className="px-3 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"> 
                    Total Trades</th> 
                  <th className="px-3 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right"> Profit</th> 
                </tr> 
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                {top10Players.map((player) => {
                  const rankStyle = rankConfig[player.rank];
                  return (
                    <tr
                      key={player.rank}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${rankStyle?.bg ?? ""
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2 font-medium text-gray-500  text-xs md:text-sm">
                        {rankStyle?.icon}
                        {player.rank}
                      </td>
                      <td className="px-6 py-4 font-semibold text-xs">{player.player || "Player"}</td>
                      <td className="px-6 py-4 text-green-600 font-medium text-xs md:text-sm">
                        {player.winRate}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {player.totalTrades.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-500 text-xs md:text-sm">
                        +{player.profit.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default DashboardPage

