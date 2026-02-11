export const RoadTypes = [
  "Big Road",
  "Bead Road",
  "Eye",
  "Small",
  "Roach",
] as const;
export type RoadTypesType = typeof RoadTypes[number];

export const USER_GAME_RESULT = "User_Game_Result";
export const USER_PROFILE = "User_Profile";