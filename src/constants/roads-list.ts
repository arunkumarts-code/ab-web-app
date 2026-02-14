export const RoadTypes = [
  "Big Road",
  "Bead Road",
  "Eye",
  "Small",
  "Roach",
] as const;
export type RoadTypesType = typeof RoadTypes[number];
