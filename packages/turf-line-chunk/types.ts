import {
  lineString,
  geometryCollection,
  featureCollection,
} from "@turf/helpers";
import lineChunk from "./";

const line = lineString([
  [0, 0],
  [1, 1],
  [2, 2],
]);
const collection = featureCollection([line]);
const geomCollection = geometryCollection([line.geometry]);

lineChunk(line, 2);
lineChunk(line, 2, { units: "kilometers" });
lineChunk(line.geometry, 2);
lineChunk(collection, 2);
lineChunk(geomCollection, 2);
