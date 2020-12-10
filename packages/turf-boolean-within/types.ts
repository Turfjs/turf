import * as helpers from "@turf/helpers";
import booleanWithin from "./index";

const pt = helpers.point([0, 0]);
const line = helpers.lineString([
  [0, 0],
  [10, 10],
]);
booleanWithin(pt, line);
