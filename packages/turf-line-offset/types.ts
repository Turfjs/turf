import lineOffset from "./";
import { lineString, multiLineString } from "@turf/helpers";

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
    [5, 5],
    [15, 15],
  ],
]);

lineOffset(line, 50);
lineOffset(line.geometry, 50);
lineOffset(multiLine, 50);
lineOffset(multiLine.geometry, 50);
lineOffset(line, 50, { units: "miles" });
