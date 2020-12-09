import {
  lineString,
  multiLineString,
  polygon,
  multiPolygon,
} from "@turf/helpers";
import lineOverlap from "./index";

const line = lineString([
  [0, 0],
  [10, 10],
]);
const multiLine = multiLineString([
  [
    [0, 0],
    [10, 10],
  ],
  [
    [30, 30],
    [50, 50],
  ],
]);
const poly = polygon([
  [
    [0, 0],
    [10, 10],
    [15, 15],
    [0, 0],
  ],
]);
const multiPoly = multiPolygon([
  [
    [
      [0, 0],
      [10, 10],
      [15, 15],
      [0, 0],
    ],
  ],
  [
    [
      [5, 5],
      [30, 30],
      [45, 45],
      [5, 5],
    ],
  ],
]);

lineOverlap(line, poly);
lineOverlap(line, line);
lineOverlap(multiPoly, line);
lineOverlap(multiPoly, multiLine);
lineOverlap(multiPoly, multiLine, { tolerance: 5 });
