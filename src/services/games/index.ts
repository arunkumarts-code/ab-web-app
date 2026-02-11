import { GameActions, GameResult } from "@/types";
import { NextPredictionAndBet } from "../common/prediction-and-bet";
import { GAME_LISTES } from "./constants/game-lists";
import { USER_GAME_RESULT, USER_PROFILE } from "@/constants/roads-list";
import { GAME_TYPE } from "./constants/game-types";

const convertResult = (results: any[]) => {
   const raw = results.map((p) => {
      let resultType = 0;
      if (p.Winner === "B") resultType = 1;
      else if (p.Winner === "P") resultType = 2;
      else if (p.Winner === "T") resultType = 3;
      return { resultType, isBankerPair: false, isPlayerPair: false };
   });
   return raw;
}

export const saveResults = (results: any[]): any[] => {
   localStorage.setItem(USER_GAME_RESULT, JSON.stringify(results));
   const convertedResult = convertResult(results);
   return convertedResult;
};

export const loadResults = (): any[] => {
   const gameData = JSON.parse(localStorage.getItem(USER_GAME_RESULT) ?? "[]");
   const convertedResult = convertResult(gameData);
   return convertedResult;
};

export const getCurrectGameData = () => {
   const userProfileStore = localStorage.getItem(USER_PROFILE);
   const userProfile = JSON.parse(userProfileStore ?? "{}");
   const userGameResultStore = localStorage.getItem(USER_GAME_RESULT);
   const userGameResult = JSON.parse(userGameResultStore ?? "[]");

   let rt = {
      Prediction: "Wait",
      MMStepIndex: 0,
      PlayerCount: 0,
      BankerCount: 0,
      TieCount: 0,
      HandCount: 0,
      StartingBalance: userProfile.currentBalance < userProfile.defaultStartingBalance
         ? userProfile.defaultStartingBalance
         : userProfile.currentBalance || 0,
      CurrentBalance: 0,
      ProfitAmount: 0,
      BetAmount: 0,
      Units: 0,
      BaseUnits: userProfile.defaultBaseUnit || 1,
      graphData: [{
         Hand: 0,
         Result: "-",
         Bet: 0,
      }] as any
   }
   const lastGameResult = userGameResult.at(-1);

   if (userGameResult.length === 0) {
      return rt;
   }

   userGameResult.forEach((result: any)=>{
      rt.HandCount += 1;
      if (result.Winner === "P") rt.PlayerCount += 1;
      if (result.Winner === "B") rt.BankerCount += 1;
      if (result.Winner === "T") rt.TieCount += 1;
   })

   const predictionBet = lastGameResult.NextHand.Wait ? "Wait" : lastGameResult.NextHand.Prediction;
   if(predictionBet === "P") {
      rt.Prediction = "Player";
   } 
   else if(predictionBet === "B") {
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

   const graphchartData = userGameResult.map((item: any) => {
      return {
         Hand: item.Id,
         Result: item.Result,
         Bet: item.Bet,
      }
   });
   rt.graphData = graphchartData;

   return rt;
}

export const addHand = (hand: GameActions) => {
   const userProfileStore = localStorage.getItem(USER_PROFILE);
   const userProfile = JSON.parse(userProfileStore ?? "{}");
   const userGameResultStore = localStorage.getItem(USER_GAME_RESULT);
   const userGameResult = JSON.parse(userGameResultStore ?? "[]");
   const gameData = GAME_LISTES[userProfile.defaultGame];

   const lastGameResult = userGameResult.at(-1);

   const lastGameBalance = userProfile.currentBalance < userProfile.defaultStartingBalance
      ? userProfile.defaultStartingBalance
      : userProfile.currentBalance || 0;

   let rt = {
      Id: userGameResult.length + 1,
      Winner: hand,
      Prediction: lastGameResult?.NextHand.Prediction ?? "WAIT",
      Result: "-",
      Bet: lastGameResult?.NextHand.BetAmount ?? 0,
      DetectedPattern: lastGameResult?.NextHand.DetectedPattern ?? "-",
      NextHand: {
         DetectedPattern: "-",
         Prediction: "WAIT",
         BetAmount: 0,
         BetUnit: 0,
         MMStep: 0,
         Wait: false,
         RecoveryList : [],
         RecoveryBalance: 0
      },
      MMStep: lastGameResult?.NextHand.MMStep ?? 0,
      iCount1: lastGameResult?.iCount1 || 0,
      iCount2: lastGameResult?.iCount2 || 0,
      VirtualWinRequired: lastGameResult?.VirtualWinRequired ||  false,
      VirtualLossRequired: lastGameResult?.VirtualLossRequired || false,
      BetUnit: lastGameResult?.NextHand.BetUnit || userProfile.defaultBaseUnit,
      BaseUnit: userProfile.defaultBaseUnit,
      StartingBalance: lastGameBalance,
      CurrentBalance: lastGameResult?.CurrentBalance || lastGameBalance,
      ProfitAmount: lastGameResult?.ProfitAmount || 0,
      Units: lastGameResult?.Units || 0,
      GMId: userProfile.defaultGame,
      MMId: userProfile.defaultMM,
      RecoveryBalance: lastGameResult?.NextHand.RecoveryBalance ?? 0,
      IsRecovered: true,
   }

   if (
      rt.Prediction !== "WAIT" &&
      rt.Prediction !== "C1" &&
      rt.Prediction !== "C2" &&
      rt.Winner !== "T"
   ){
      rt.Result = rt.Winner === rt.Prediction ? "Win" : "Loss";
   }
   if (lastGameResult?.NextHand.Wait){
      rt.Result = "-";
   }
   
   let newRecoverResult = userGameResult;

   if (rt.Result === "Win") {
      if(rt.Bet !== 0 ){
         if ( userProfile?.defaultGame === GAME_TYPE.COCOA_BEACH ) {
               lastGameResult?.NextHand?.RecoveryList.forEach((r:any)=>{
                  newRecoverResult[r - 1] = {
                     ...newRecoverResult[r - 1],
                     IsRecovered: true,
                  };
               })
            }
      }
      rt.Units += Math.ceil(Math.ceil(rt.Bet) / userProfile.defaultBaseUnit);
      if (rt.Winner === "B") rt.Bet *= 0.95;
      rt.CurrentBalance = Number(
         (rt.CurrentBalance + rt.Bet).toFixed(2)
      );
      rt.ProfitAmount = Number(
         (rt.ProfitAmount + rt.Bet).toFixed(2)
      );
   } else if (rt.Result === "Loss") {
      rt.Units -= Math.ceil(Math.ceil(rt.Bet) / userProfile.defaultBaseUnit);
      rt.IsRecovered = false;
      rt.CurrentBalance = Number(
         (rt.CurrentBalance + (-rt.Bet)).toFixed(2)
      );
      rt.ProfitAmount = Number(
         (rt.ProfitAmount + (-rt.Bet)).toFixed(2)
      );
   } else {
      rt.Bet = 0;
      rt.BetUnit = 0;
      rt.CurrentBalance = Number(
         (rt.CurrentBalance + rt.Bet).toFixed(2)
      );
      rt.ProfitAmount = Number(
         (rt.ProfitAmount + rt.Bet).toFixed(2)
      );
   }

   let newGameResult = [...newRecoverResult, rt] 
   if (newGameResult.length > gameData.gmStartAt - 1) {
      const tmpNextHand = NextPredictionAndBet(newGameResult, userProfile);
      rt.iCount1 = tmpNextHand.iCount1;
      rt.iCount2 = tmpNextHand.iCount2;
      rt.VirtualLossRequired = tmpNextHand.VirtualLossRequired;
      rt.VirtualWinRequired = tmpNextHand.VirtualWinRequired;
      rt.NextHand.BetAmount = tmpNextHand.BetAmount
      rt.NextHand.BetUnit = tmpNextHand.BetUnit
      rt.NextHand.Prediction = tmpNextHand.Prediction
      rt.NextHand.DetectedPattern = tmpNextHand.DetectedPattern
      rt.NextHand.MMStep = tmpNextHand.MMStep
      rt.NextHand.RecoveryList = tmpNextHand.RecoveryList
      rt.NextHand.RecoveryBalance = tmpNextHand.RecoveryBalance

      if (tmpNextHand.VirtualLossRequired || tmpNextHand.VirtualWinRequired) {
         rt.NextHand.Wait = true;
         rt.NextHand.BetAmount = 0
         rt.NextHand.BetUnit = 0
      }
   }
   newGameResult = [...newRecoverResult, rt] 
   
   return saveResults(newGameResult);
}

export const restartGame = (): GameResult[] => {
   try {
      const userProfileStore = localStorage.getItem(USER_PROFILE);
      const userProfile = JSON.parse(userProfileStore ?? "{}");
      const userGameResultStore = localStorage.getItem(USER_GAME_RESULT);
      const userGameResult = JSON.parse(userGameResultStore ?? "[]");
      localStorage.removeItem(USER_GAME_RESULT);
      
      const lastGame = userGameResult.at(-1);
      const gameEndProfite = lastGame?.CurrentBalance - lastGame?.StartingBalance || 0;
``
      console.log("Game End Profite: ", gameEndProfite);
      const profile = {
         ...userProfile,
         currentBalance: lastGame?.CurrentBalance
      };

      localStorage.setItem(
         USER_PROFILE,
         JSON.stringify(profile)
      );

      return [];
   } catch (error) {
      console.error('Error restarting game:', error);
      return [];
   }
}

export const undoHand = () => {
   try {
      const userProfileStore = localStorage.getItem(USER_PROFILE);
      const userProfile = JSON.parse(userProfileStore ?? "{}");

      const gameData = JSON.parse(
         localStorage.getItem(USER_GAME_RESULT) ?? "[]"
      );

      if (gameData.length === 0) {
         return [];
      }

      const lastHand = gameData.at(-1);
      const lastHandRecoveryList = lastHand?.NextHand.RecoveryList || [];
      let newRecoverResult = gameData;

      if (lastHandRecoveryList.length > 0) {
         lastHandRecoveryList.forEach((r: any) => {
            newRecoverResult[r - 1] = {
               ...newRecoverResult[r - 1],
               IsRecovered: false,
            };
         })
      }

      const newGameData = newRecoverResult.slice(0, -1);

      const tmpNextHand = NextPredictionAndBet(newGameData, userProfile);
      const nextHand: any = {
         BetAmount: tmpNextHand.BetAmount,
         BetUnit: tmpNextHand.BetUnit,
         Prediction: tmpNextHand.Prediction,
         DetectedPattern: tmpNextHand.DetectedPattern,
         MMStep: tmpNextHand.MMStep,
         RecoveryList: tmpNextHand.RecoveryList,
      };
      if (tmpNextHand.VirtualLossRequired || tmpNextHand.VirtualWinRequired) {
         nextHand.Wait = true;
         nextHand.BetAmount = 0;
         nextHand.BetUnit = 0;
      }
      
      newRecoverResult[newRecoverResult.length - 1] = {
         ...newRecoverResult[newRecoverResult.length - 1],
         iCount1 : tmpNextHand.iCount1,
         iCount2 : tmpNextHand.iCount2,
         VirtualLossRequired : tmpNextHand.VirtualLossRequired,
         VirtualWinRequired : tmpNextHand.VirtualWinRequired,
         NextHand: {
            ...newRecoverResult[newRecoverResult.length - 1].NextHand,
            ...nextHand,
         }
      }

      return saveResults(newGameData);
   } catch (error) {
      console.error('Error undoing hand:', error);
      return [];
   }
}

export const skipHand = () => {
   const userGameResultStore = localStorage.getItem(USER_GAME_RESULT);
   const userGameResult = JSON.parse(userGameResultStore ?? "[]");
   const lastHand = userGameResult[userGameResult.length - 1];

   userGameResult[userGameResult.length - 1] = {
      ...userGameResult[userGameResult.length - 1],
      NextHand: {
         ...userGameResult[userGameResult.length - 1].NextHand,
         BetAmount: 0,
         RecoveryList: [],
         MMStep: lastHand.MMStep || 0,
         RecoveryBalance: lastHand.RecoveryBalance || 0,
      },
   };

   localStorage.setItem(USER_GAME_RESULT, JSON.stringify(userGameResult));
}