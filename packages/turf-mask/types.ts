import { polygon } from "@turf/helpers";
import mask from "./";

const poly1 = polygon([
  [
    [-50, 5],
    [-40, -10],
    [-50, -10],
    [-40, 5],
    [-50, 5],
  ],
]);
const poly2 = polygon([
  [
    [30, 5],
    [-40, -10],
    [-50, -10],
    [-40, 5],
    [30, 5],
  ],
]);

mask(poly1);
mask(poly1, poly2);
