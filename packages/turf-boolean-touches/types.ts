import * as helpers from "@turf/helpers";
import { booleanTouches } from "./index";

const pt = helpers.point([0, 0]);
const line = helpers.lineString([
  [0, 0],
  [10, 10],
]);
booleanTouches(pt, line);
