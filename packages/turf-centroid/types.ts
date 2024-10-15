import { lineString } from "@turf/helpers";
import { centroid } from "./index.js";

const line = lineString([
  [0, 0],
  [10, 10],
]);

centroid(line);
centroid(line, { properties: { foo: "bar" } });
