import { LineString, Feature, Polygon } from "geojson";
import { lineString, polygon, featureCollection } from "@turf/helpers";
import scale from "./";

const line = lineString([
  [0, 0],
  [10, 29],
]);
const poly = polygon([
  [
    [0, 29],
    [3.5, 29],
    [2.5, 32],
    [0, 29],
  ],
]);

// Does not mutate Geometry type
const scaledPt: LineString = scale(line.geometry, 1.5);
const scaledPoly: Feature<Polygon> = scale(poly, 1.5);

// Diferent Geometry inputs
scale(line.geometry, 1.5);
scale(poly.geometry, 1.5);
scale(featureCollection([poly]), 1.5);

// All params
scale(poly, 1.5);
scale(poly, 1.5, { origin: [10, 10] });
scale(poly, 1.5, { origin: "ne", mutate: true });
