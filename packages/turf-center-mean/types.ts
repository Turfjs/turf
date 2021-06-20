import { lineString } from "@turf/helpers";
import centerMean from "./index";

const line = lineString([
  [0, 0],
  [10, 10],
]);

centerMean(line);
centerMean(line, { properties: { foo: "bar" } });
centerMean(line, { weight: "foo" });
