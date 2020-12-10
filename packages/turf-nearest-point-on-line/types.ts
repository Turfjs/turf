import nearestPointOnLine from "./index";
import { point, lineString, multiLineString } from "@turf/helpers";

const pt = point([1.5, 1.5]);
const line = lineString([
  [0, 0],
  [1, 1],
]);
const multiLine = multiLineString([
  [
    [0, 0],
    [1, 1],
    [2, 2],
    [0, 0],
  ],
]);

// All combinations of parameters
nearestPointOnLine(line, pt);
nearestPointOnLine(multiLine, pt);
nearestPointOnLine(line.geometry, pt);
nearestPointOnLine(multiLine.geometry, pt);
nearestPointOnLine(line, pt, { units: "miles" });

// Output can be used as Input
const output = nearestPointOnLine(line, pt);
nearestPointOnLine(line, output);

// Extra properties being generated from module
output.properties.dist;
output.properties.index;
output.properties.location;
