import { Feature, Polygon } from "geojson";
import { polygon } from "@turf/helpers";
import simplify from "./";

const poly = polygon([
  [
    [0, 0],
    [10, 10],
    [20, 20],
    [0, 0],
  ],
]);

// Output type is the same as Input type
const simple: Feature<Polygon> = simplify(poly);

// Extra params
simplify(poly, { tolerance: 1 });
simplify(poly, { tolerance: 1, highQuality: true });
