import api from "@/configs/axios"
import { GameActions } from "@/types";

const convertResult = (userGameResults: any[]) => {
   const raw = userGameResults.map((p) => {
      let resultType = 0;
      if (p.Winner === "B") resultType = 1;
      else if (p.Winner === "P") resultType = 2;
      else if (p.Winner === "T") resultType = 3;
      return { resultType, isBankerPair: false, isPlayerPair: false };
   });
   return raw;
}

const currentGameData = (userGameData: any) => {
   const userGameResults = userGameData.ugResultList || [];

   let rt = {
      Prediction: "Wait",
      MMStepIndex: 0,
      PlayerCount: 0,
      BankerCount: 0,
      TieCount: 0,
      HandCount: 0,
      StartingBalance: userGameData.ugStartingBalance || 0,
      CurrentBalance: 0,
      ProfitAmount: 0,
      BetAmount: 0,
      Units: 0,
      MMId: userGameData.mmId || 0,
      GameId: userGameData.gmId || 0,
      BaseUnits: userGameData.ugBaseUnit || 1,
      graphData: [{
         Hand: 0,
         Result: "-",
         Bet: 0,
      }] as any
   }

   const lastGameResult = userGameResults.at(-1);

   if (userGameResults.length === 0) {
      return rt;
   }

   userGameResults.forEach((result: any) => {
      rt.HandCount += 1;
      if (result.Winner === "P") rt.PlayerCount += 1;
      if (result.Winner === "B") rt.BankerCount += 1;
      if (result.Winner === "T") rt.TieCount += 1;
   })

   const predictionBet = lastGameResult.NextHand.Wait ? "Wait" : lastGameResult.NextHand.Prediction;
   if (predictionBet === "P") {
      rt.Prediction = "Player";
   }
   else if (predictionBet === "B") {
      rt.Prediction = "Banker";
   }
   else {
      rt.Prediction = "Wait";
   }

   rt.MMStepIndex = lastGameResult.NextHand.MMStep;
   rt.CurrentBalance = lastGameResult.CurrentBalance;
   rt.ProfitAmount = lastGameResult.ProfitAmount;
   rt.BetAmount = lastGameResult.NextHand.BetAmount;
   rt.Units = lastGameResult.Units;

   const graphchartData = userGameResults.map((item: any) => {
      return {
         Hand: item.Id,
         Result: item.Result,
         Bet: item.Bet,
      }
   });
   rt.graphData = graphchartData;

   return rt;
}

export const getGameResults = async () => {
   try {
      const response = await api.get("/game/results");
      const responseData = response.data;
      const userGameData = responseData.data;
      const userGameResults = userGameData.ugResultList || [];
   
      const convertedResult = convertResult(userGameResults);
      const currentGame = currentGameData(userGameData);
   
      return { currentGame, userGameResults, convertedResult };

   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while fetching game results";

      throw new Error(message);
   }
}

export const addHand = async (hand: GameActions) => {
   try{
      const response = await api.post("/game/add", { hand });
      const responseData = response.data;
      const userGameData = responseData.data;
      const userGameResults = userGameData.ugResultList || [];
   
      const convertedResult = convertResult(userGameResults);
      const currentGame = currentGameData(userGameData);
   
      return { currentGame, userGameResults, convertedResult };

   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while adding the hand";

      throw new Error(message);
   }
}

export const undoHand = async () => {
   try{
      const response = await api.post("/game/undo", );
      const responseData = response.data;
      const userGameData = responseData.data;
      const userGameResults = userGameData.ugResultList || [];
   
      const convertedResult = convertResult(userGameResults);
      const currentGame = currentGameData(userGameData);
   
      return { currentGame, userGameResults, convertedResult };

   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while undoing the hand";

      throw new Error(message);
   }
}

export const skipHand = async () => {
   try{
      const response = await api.post("/game/skip");
      const responseData = response.data;
      const userGameData = responseData.data;
      const userGameResults = userGameData.ugResultList || [];
   
      const convertedResult = convertResult(userGameResults);
      const currentGame = currentGameData(userGameData);
   
      return { currentGame, userGameResults, convertedResult };

   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while skipping the hand";

      throw new Error(message);
   }
}

export const newGame = async (GameID?: string, MMID?: string, BaseUnit?: number) => {
   try {
      const response = await api.post("/game/new", { GameID, MMID, BaseUnit });
      const responseData = response.data;
      const userGameData = responseData.data;
      const userGameResults = userGameData.ugResultList || [];

      const convertedResult = convertResult(userGameResults);
      const currentGame = currentGameData(userGameData);

      return { currentGame, userGameResults, convertedResult };

   } catch (error: any) {
      const message =
         error?.response?.data?.message ||
         error?.message ||
         "Something went wrong while skipping the hand";

      throw new Error(message);
   }
}