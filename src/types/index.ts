export interface AuthResult {
   success: boolean;
   error?: string;
}

export interface ApiResponse<T> {
   success: boolean;
   message?: string;
   error?: string;
   data?: T;
}

export type GameActions = "P" | "B" | "T";
export type PredictionType = "P" | "B" | "W";

export interface GameResult1 {
   Id: number,
   Winner: GameActions,
   GameName: string,
   Prediction: PredictionType,
   Bet: number,
   DetectedPattern: string | number,
   NextHand: PredictionType,
   iCount1: number,
   iCount2: number,
   VirtualWinRequired: boolean,
   VirtualLossRequired: boolean,
};
export interface GameResult {
   resultType: number;
   isBankerPair: boolean;
   isPlayerPair: boolean;
};

export interface User {
   id: string;
   firebaseUid: string;
   firstName: string;
   lastName: string;
   userNickName: string;
   userAvatar: string;
   userEmail: string;
   createdAt: string;
   provider: string;
   lastLoginAt: string;
}