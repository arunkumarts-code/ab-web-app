import api from "@/configs/axios";

export const getProfitGraphData = async (type: string = "day") => {
   try {
      const response = await api.get(`/dashboard/profit/${type}`);
      const responseData = response.data;

      return {
         data: responseData?.data || [],
         profitSummary: responseData?.profitSummary || {
            currentProfit: 0,
            previousProfit: 0,
         },
      };
   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while fetching game profites";

      throw new Error(message);
   }
};

export const getTop10Players = async (type: string = "day") => {
   try {
      const response = await api.get(`/dashboard/top10/${type}`);
      const responseData = response.data;

      return responseData?.data || [];
   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while fetching game profites";

      throw new Error(message);
   }
};

export const getLiveWins = async () => { 
   try {
      const response = await api.get("/dashboard/live-wins");
      const responseData = response.data;
      
      return responseData?.data || [];

   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while fetching live wins";

      throw new Error(message);
   }
};