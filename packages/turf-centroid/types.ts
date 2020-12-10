import { lineString } from "@turf/helpers";
import centroid from "./index";

const line = lineString([
  [0, 0],
  [10, 10],
]);

centroid(line);
centroid(line, { properties: { foo: "bar" } });
