"use client";

import GlobalLoader from "@/components/common/GlobalLoader";
import DataGrid, { DataGridColumn, DataGridAction } from "@/components/common/DataGrid";
import GridPagination from "@/components/common/GridPagination";
import { getUserGameHistorySummary, getUserGamesHistory, getGameDataById } from "@/services/history.service";
import { useEffect, useState } from "react";
import { FaArrowDown, FaTrophy, FaWallet, FaEye } from "react-icons/fa6";
import { formatDateTime } from "@/utils/dateFormat";
import HandHistoryModal from "@/components/history/HandHistoryModal";

interface GameHistoryItem {
  ugId: string;
  profit: number;
  isWin: boolean;
  ugBaseUnit: number;
  ugStartingBalance: number;
  createdAt: string;
}

interface GameStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  totalProfit: number;
}

interface PaginationData {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const HistoryPage = () => {
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadGameData = async (page = 1, limit = 10) => {
    try {
      setTableLoading(true);
      const [historyResponse, summaryResponse] = await Promise.all([
        getUserGamesHistory({ page, limit }),
        getUserGameHistorySummary(),
      ]);

      if (historyResponse?.success && historyResponse?.data) {
        setGameHistory(historyResponse.data);
        setPagination(historyResponse.pagination);
      }

      if (summaryResponse?.success && summaryResponse?.data) {
        setGameStats(summaryResponse.data);
      }
    } catch (error) {
      console.error("Error loading game data:", error);
    } finally {
      setTableLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGameData();
  }, []);

  const handleViewGame = async (gameId: string) => {
    try {
      setLoading(true);
      const response = await getGameDataById(gameId);
      setSelectedGame(response || []);
      setModalOpen(true);  
      setLoading(false);

    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  const handlePageChange = (page: number) => {
    loadGameData(page, pagination.limit);
  };

  const handlePageSizeChange = (size: number) => {
    loadGameData(1, size);
  };

  const columns: DataGridColumn[] = [
    {
      key: "gameNo",
      label: "Game No",
      width: "80px",
      render: (_, row, __) => {
        const index = gameHistory.findIndex((h) => h.ugId === row.ugId) + 1 + (pagination.currentPage - 1) * pagination.limit;
        return `#${index}`;
      },
    },
    {
      key: "createdAt",
      label: "Game Date",
      render: (value) => formatDateTime(value),
    },
    {
      key: "ugStartingBalance",
      label: "Start Balance",
      width: "130px",
      align: "right",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "profit",
      label: "Profit/Loss",
      width: "120px",
      align: "right",
      render: (value) => (
        <span className={value >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
          {value >= 0 ? "+" : ""}{value.toFixed(2)}
        </span>
      ),
    },
  ];

  const actions: DataGridAction[] = [
    {
      id: "view",
      label: "View",
      icon: <FaEye className="w-4 h-4" />,
      className: "text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors",
      onClick: (row) => handleViewGame(row.ugId),
    },
  ];

  return (
    <>
      {loading && <GlobalLoader />}

      <div className="flex flex-col space-y-4 sm:space-y-6 w-full h-full">
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">Game History</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">Review your game performance and statistics.</p>
        </div>

        {/* Stats Grid */}
        {gameStats && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Wins Card */}
            <div className="bg-surface p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-border transition-colors hover:shadow-md">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted">Total Wins</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-500 mt-1 sm:mt-2">
                    {gameStats.totalWins}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {gameStats.totalGames > 0 && `${((gameStats.totalWins / gameStats.totalGames) * 100).toFixed(1)}%`}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-lg shrink-0">
                  <FaTrophy className="text-base sm:text-lg" />
                </div>
              </div>
            </div>

            {/* Total Losses Card */}
            <div className="bg-surface p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-border transition-colors hover:shadow-md">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted">Total Losses</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-500 mt-1 sm:mt-2">
                    {gameStats.totalLosses}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {gameStats.totalGames > 0 && `${((gameStats.totalLosses / gameStats.totalGames) * 100).toFixed(1)}%`}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg shrink-0">
                  <FaArrowDown className="text-base sm:text-lg" />
                </div>
              </div>
            </div>

            {/* Total Games Card */}
            <div className="bg-surface p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-border transition-colors hover:shadow-md">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted">Total Games</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1 sm:mt-2">
                    {gameStats.totalGames}
                  </p>
                  <p className="text-xs text-muted mt-1">Games played</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Profit Card */}
            <div className="bg-surface p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-border transition-colors hover:shadow-md">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted">Total Profit</p>
                  <p
                    className={`text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 ${
                      gameStats.totalProfit >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {gameStats.totalProfit >= 0 ? "+" : ""}{gameStats.totalProfit.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted mt-1">Overall</p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-lg shrink-0 ${
                    gameStats.totalProfit >= 0
                      ? "bg-green-50 dark:bg-green-900/20 text-green-500"
                      : "bg-red-50 dark:bg-red-900/20 text-red-500"
                  }`}
                >
                  <FaWallet className="text-base sm:text-lg" />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Game History Table */}
        <div className="bg-surface rounded-lg sm:rounded-xl shadow-sm border border-border overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="p-4 sm:p-6 border-b border-border">
            <h3 className="font-bold text-base sm:text-lg">Game History</h3>
            <p className="text-xs sm:text-sm text-muted mt-1">All your played games</p>
          </div>

          <div className="flex-1 min-h-0">
            <DataGrid
              columns={columns}
              rows={gameHistory}
              loading={tableLoading}
              error={null}
              actions={actions}
              containerHeight="flex-1"
              noDataMessage="No games found"
              rowClassName="hover:bg-background/50 transition-colors cursor-pointer"
            />
          </div>

          {/* Pagination */}
          <GridPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.limit}
            totalRecords={pagination.totalRecords}
            pageSizeOptions={[10, 20, 50]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

        {/* Hand History Modal */}
        <HandHistoryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          loading={loading}
          handHistory={selectedGame || []}
        />
      </div>
    </>
  );
};


export default HistoryPage;