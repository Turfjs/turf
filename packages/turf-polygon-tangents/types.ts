import { polygon, point } from "@turf/helpers";
import tangents from "./";

const poly = polygon([
  [
    [11, 0],
    [22, 4],
    [31, 0],
    [31, 11],
    [21, 15],
    [11, 11],
    [11, 0],
  ],
]);
const pt = point([61, 5]);
tangents(pt, poly);
