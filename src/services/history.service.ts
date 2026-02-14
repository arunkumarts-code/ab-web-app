import api from "@/configs/axios";

interface HistoryParams {
   page?: number;
   limit?: number;
}

export const getUserGamesHistory = async ({
   page = 1,
   limit = 10,
}: HistoryParams = {}) => {
   try {
      const response = await api.get("/history", {
         params: {
            page,
            limit,
         },
      });
      return response.data;

   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while fetching user games history";

      throw new Error(message);
   }
};

export const getUserGameHistorySummary = async () => {
   try {
      const response = await api.get("/history/summary");
      return response.data;
   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while fetching user game history summary";
      throw new Error(message);
   }
};

export const getGameDataById = async (gameId: string) => {
   try {
      const response = await api.get(`/history/game/${gameId}`);
      console.log("Game data response:", response.data);
      const responseData = response.data;

      if(!responseData.success) {
         return [];
      }

      const hands = responseData.data
         .filter((item: any) => item.Result === "Win" || item.Result === "Loss")
         .map((item: any) => ({
            id: item.Id,
            result: item.Result,
            bet: item.Bet,
         }));
      return hands;
   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while fetching game data";
      throw new Error(message);
   }
};