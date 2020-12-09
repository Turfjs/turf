import { lineString } from "@turf/helpers";
import centerOfMass from "./index";

const line = lineString([
  [0, 0],
  [10, 10],
]);

centerOfMass(line);
centerOfMass(line, { properties: { foo: "bar" } });
