import { MM_LOOKUP } from "../money-management/mm-lookup";
import { GAME_TYPE } from "../games/constants/game-types";
import { GAME_LOOKUP } from "../games/game-lookup";

export const NextPredictionAndBet = (results: any, UserGame: any) => {
   const rt = {
      MMStep: 0,
      DetectedPattern: "-",
      Prediction: "WAIT",
      BetAmount: 0,
      BetUnit: 0,
      iCount1: 0,
      iCount2: 0,
      VirtualWinRequired: false,
      VirtualLossRequired: false,
      RecoveryList : [],
      RecoveryBalance: 0
   };   

   const { defaultGame, defaultMM, defaultBaseUnit } = UserGame;
   const game_process = GAME_LOOKUP[defaultGame]

   let tmpResults = results.filter((r: any) => r.Winner !== "T") ?? [];

   const gamePrediction = game_process(tmpResults);
   rt.Prediction = gamePrediction.Prediction;
   rt.DetectedPattern = gamePrediction.DetectedPattern;


   if ( defaultGame === GAME_TYPE.COCOA_BEACH ) {
      rt.iCount1 = gamePrediction?.iCount1 || 0;
      rt.iCount2 = gamePrediction?.iCount2 || 0;
   }

   if (gamePrediction.VirtualLossRequired) rt.VirtualLossRequired = true;
   else if (gamePrediction.VirtualWinRequired) rt.VirtualWinRequired = true;


   let tmpResultList: any[] = [];
   tmpResultList = (results || []).filter((p: any) => p.Result !== "-");

   const mm_process = MM_LOOKUP[defaultMM];

   const { BetAmount, MMStep, userRecoryList, RecoveryBalance } = mm_process(tmpResultList);
   if (gamePrediction.CalculateBet) {
      rt.BetAmount = BetAmount;
      rt.BetUnit = BetAmount / (defaultBaseUnit || 1);
      rt.MMStep = MMStep;
      rt.RecoveryList = userRecoryList;
      rt.RecoveryBalance = RecoveryBalance;
   }

   return rt;
};