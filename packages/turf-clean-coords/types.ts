import { multiPoint } from "@turf/helpers";
import cleanCoords from "./index";

// Fixtures
const multiPt = multiPoint([
  [0, 0],
  [0, 0],
  [2, 2],
]);

// Feature
cleanCoords(multiPt).geometry;
cleanCoords(multiPt).properties;

// Geometry
cleanCoords(multiPt.geometry).coordinates;
cleanCoords(multiPt.geometry).type;

// Input mutation
cleanCoords(multiPt.geometry, { mutate: true });
