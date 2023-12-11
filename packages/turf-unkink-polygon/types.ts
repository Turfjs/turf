import { polygon, multiPolygon } from "@turf/helpers";
import { unkinkPolygon as unkink } from "./index";

const poly = polygon([
  [
    [20, 30],
    [10, 10],
    [20, 20],
    [20, 30],
  ],
]);
const multiPoly = multiPolygon([
  [
    [
      [20, 30],
      [10, 10],
      [20, 20],
      [20, 30],
    ],
  ],
  [
    [
      [0, 0],
      [10, 10],
      [20, 20],
      [0, 0],
    ],
  ],
]);

unkink(poly);
unkink(multiPoly);
