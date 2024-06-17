import { Units } from "./Units.js";

export type AreaUnits =
  | Exclude<Units, "radians" | "degrees">
  | "acres"
  | "hectares";
