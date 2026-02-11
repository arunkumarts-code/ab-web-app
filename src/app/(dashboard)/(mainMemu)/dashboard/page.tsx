"use client";

import GameProfitBars from "@/components/dashboard/BarChart";
import { JSX, useState } from "react";
import { FaWallet, FaArrowUp, FaChartLine, FaMedal, FaTrophy } from "react-icons/fa6";

const PERIODS = ["Day", "Week", "Month", "Quarter", "Year"];

const liveWins = [
  {
    id: 1,
    initials: "JD",
    name: "John D.",
    time: "Just now",
    amount: 120,
    avatarBg: "bg-indigo-500",
    opacity: "opacity-100",
  },
  {
    id: 2,
    initials: "SM",
    name: "Sarah M.",
    time: "2s ago",
    amount: 450,
    avatarBg: "bg-pink-500",
    opacity: "opacity-100",
  },
  {
    id: 3,
    initials: "MK",
    name: "Mike K.",
    time: "5s ago",
    amount: 85,
    avatarBg: "bg-orange-500",
    opacity: "opacity-100",
  },
  {
    id: 4,
    initials: "TR",
    name: "TraderRex",
    time: "12s ago",
    amount: 1200,
    avatarBg: "bg-blue-500",
    opacity: "opacity-75",
  },
  {
    id: 5,
    initials: "AL",
    name: "Alex L.",
    time: "15s ago",
    amount: 40,
    avatarBg: "bg-teal-500",
    opacity: "opacity-60",
  },
  {
    id: 6,
    initials: "JR",
    name: "John R.",
    time: "19s ago",
    amount: 123,
    avatarBg: "bg-orange-500",
    opacity: "opacity-50",
  },
];

const gameData = [
  { game: 1, profite: 50 },
  { game: 2, profite: 150 },
  { game: 3, profite: 100 },
  { game: 4, profite: -20 },
  { game: 5, profite: 50 },
  { game: 6, profite: -150 },
  // { game: 7, profite: 80 },
  // { game: 8, profite: 120 },
  // { game: 9, profite: 60 },
  // { game: 10, profite: -40 },
  // { game: 11, profite: -40 },
  // { game: 17, profite: 300 },
  // { game: 18, profite: -46 },
  // { game: 19, profite: 36 },
  // { game: 20, profite: 56 },
  // { game: 21, profite: 16 },
  // { game: 22, profite: -36 },
  // { game: 23, profite: 96 },
];

const topPlayers = [
  {
    rank: 1,
    name: "CryptoKing99",
    winRate: "88%",
    trades: 1240,
    profit: 25400,
    highlight: "gold",
  },
  {
    rank: 2,
    name: "SilverSurfer",
    winRate: "82%",
    trades: 980,
    profit: 18200,
    highlight: "silver",
  },
  {
    rank: 3,
    name: "BronzeBeast",
    winRate: "79%",
    trades: 1105,
    profit: 15850,
    highlight: "bronze",
  },
  {
    rank: 4,
    name: "AlphaTrader",
    winRate: "75%",
    trades: 850,
    profit: 12400,
  },
  {
    rank: 5,
    name: "MoonWalker",
    winRate: "71%",
    trades: 620,
    profit: 10100,
  },
  {
    rank: 6,
    name: "HodlGang",
    winRate: "68%",
    trades: 1500,
    profit: 9850,
  },
  {
    rank: 7,
    name: "SatoshiFan",
    winRate: "65%",
    trades: 430,
    profit: 8200,
  },
  {
    rank: 8,
    name: "BearHunter",
    winRate: "62%",
    trades: 510,
    profit: 7400,
  },
];

const rankConfig: Record<
  number,
  {
    bg: string;
    icon: JSX.Element;
  }
> = {
  1: {
    bg: "bg-yellow-50/50 dark:bg-yellow-900/10",
    icon: <FaTrophy className="text-yellow-500 dark:text-yellow-400 text-lg" />,
  },
  2: {
    bg: "bg-gray-50/50 dark:bg-gray-800/20",
    icon: <FaMedal className="text-gray-400 dark:text-gray-300 text-lg" />,
  },
  3: {
    bg: "bg-orange-50/50 dark:bg-orange-900/10",
    icon: <FaMedal className="text-orange-400 dark:text-orange-300 text-lg" />,
  },
};

const DashboardPage = () => {
  const [activePeriod, setActivePeriod] = useState("Day");
  
  return (
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

      <div className="">
        {/* Net Profit Card */}
        <div className="transition-colors bg-surface p-6 rounded-xl shadow-sm border border-border lg:col-span-2">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted">
                Net Profit Day
              </p>
              <div className="flex items-baseline gap-3 mt-2">
                <h2 className="text-2xl font-bold text-green-500">+ $450.00</h2>
                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold flex items-center gap-1">
                  <FaArrowUp className="text-[0.6rem]" /> 12.5%
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-lg">
              <FaChartLine className="text-md" />
            </div>
          </div>

          {/* Mini Bar Chart */}
          {/* <div className="mt-4 h-10 w-full rounded flex items-end px-2 pb-1 gap-1">
            <div className="min-w-20 bg-green-200 dark:bg-green-800 h-1/2 rounded-sm"></div>
            <div className="min-w-20 bg-green-300 dark:bg-green-700 h-3/4 rounded-sm"></div>
            <div className="min-w-20 bg-green-400 dark:bg-green-600 h-2/3 rounded-sm"></div>
            <div className="min-w-20 bg-green-500 dark:bg-green-500 h-full rounded-sm"></div>
            <div className="min-w-20 bg-red-400 dark:bg-red-400 h-4/5 rounded-sm"></div>
            <div className="min-w-20 bg-green-300 dark:bg-green-700 h-3/5 rounded-sm"></div>
            <div className="min-w-20 bg-green-300 dark:bg-green-700 h-3/5 rounded-sm"></div>
            <div className="min-w-20 bg-green-300 dark:bg-green-700 h-3/5 rounded-sm"></div>
            <div className="min-w-20 bg-green-300 dark:bg-green-700 h-3/5 rounded-sm"></div>
          </div> */}
          <GameProfitBars 
            data={gameData} 
            height="h-20"
            gap="gap-2"
            barWidth="w-18" 
          />
        </div>

      </div>


      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div
          className="card-transition xl:col-span-1 bg-surface rounded-xl shadow-sm border border-border flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-md">Live Wins</h3>
            <span
              className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-1 rounded font-bold animate-pulse">LIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {liveWins.map((win) => (
              <div
                key={win.id}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition ${win.opacity}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${win.avatarBg} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {win.initials}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{win.name}</p>
                    <p className="text-xs text-gray-500">{win.time}</p>
                  </div>
                </div>

                <span className="text-green-500 font-bold text-sm">
                  +${win.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="card-transition xl:col-span-3 bg-surface rounded-xl shadow-sm border border-border h-[600px] flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-md">Top 10 Players</h3>
              <p className="text-sm text-muted">Rankings based on highest profit for the selected period.
              </p>
            </div>
            <button className="text-sm text-primary font-semibold hover:underline">View All</button>
          </div>

          <div className="overflow-auto flex-1 p-0 scrollbar-custom">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10"> 
                <tr> 
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"> 
                    Rank</th> 
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"> 
                    Player</th> 
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"> 
                    Win Rate</th> 
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"> 
                    Total Trades</th> 
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right"> Profit</th> 
                </tr> 
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                {topPlayers.map((player) => {
                  const rankStyle = rankConfig[player.rank];
                  return (
                    <tr
                      key={player.rank}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${rankStyle?.bg ?? ""
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2 font-medium text-gray-500">
                        {rankStyle?.icon}
                        {player.rank}
                      </td>
                      <td className="px-6 py-4 font-semibold">{player.name}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">
                        {player.winRate}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {player.trades.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-500">
                        +${player.profit.toLocaleString()}
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
  )
}

export default DashboardPage

