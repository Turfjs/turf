/*
// Temporarily disabling due to error after upgrading to type: module
// TS2339: Property 'default' does not exist on type ...
import { polygon } from "@turf/helpers";
import { kinks } from "./index.js";

const hourglass = polygon([
  [
    [-50, 5],
    [-40, -10],
    [-50, -10],
    [-40, 5],
    [-50, 5],
  ],
]);
kinks(hourglass);
*/
