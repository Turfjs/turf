import { polygon } from "@turf/helpers";
import kinks from "./index";

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
