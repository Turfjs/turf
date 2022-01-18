import { polygon, featureCollection } from "@turf/helpers";
import union from "./index";

const poly1 = polygon([
  [
    [0, 0],
    [10, 10],
    [20, 20],
    [0, 0],
  ],
]);
const poly2 = polygon([
  [
    [20, 30],
    [10, 10],
    [20, 20],
    [20, 30],
  ],
]);
union(featureCollection([poly1, poly2]));
