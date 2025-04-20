// src/types/cricketTypes.ts

export type DeliveryType =
  | "normal"
  | "overthrow"
  | "bye"
  | "legbye"
  | "noball"
  | "wide"
  | "wicket"
  | "noball+bye"
  | "noball+legbye"
  | "wide+bye"
  | "wide+legbye"
  | "wide+overthrow"
  | "noball+bye+overthrow"
  | "noball+legbye+overthrow"
  | "wide+bye+overthrow"
  | "wide+legbye+overthrow"
  | "normal+overthrow"
  | "bye+overthrow"
  | "legbye+overthrow"
  | "noball+overthrow"

export interface PlayerStats {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  wickets: number;
  overs: number;
  maidens: number;
  runsConceded: number;
}
