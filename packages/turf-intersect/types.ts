import { featureCollection, polygon } from "@turf/helpers";
import intersect from "./index";

const poly1 = polygon([
  [
    [0, 0],
    [1, 1],
    [3, 0],
    [0, 0],
  ],
]);
const poly2 = polygon([
  [
    [10, 10],
    [21, 21],
    [0, 4],
    [10, 10],
  ],
]);

const match = intersect(featureCollection([poly1, poly2]));

if (match === null) console.log("foo");

const foo = intersect(featureCollection([poly1, poly2])) || "bar";
