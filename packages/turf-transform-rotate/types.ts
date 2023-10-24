import { Point, Feature, Polygon, FeatureCollection } from "geojson";
import {
  polygon,
  point,
  featureCollection,
  geometryCollection,
} from "@turf/helpers";
import rotate from "./";

const pt = point([15, 15]);
const poly = polygon([
  [
    [0, 29],
    [3.5, 29],
    [2.5, 32],
    [0, 29],
  ],
]);

// Does not mutate Geometry type
const rotatedPoly: Feature<Polygon> = rotate(poly, 100, { pivot: pt });
const rotatedFCPoly: FeatureCollection<Polygon> = rotate(
  featureCollection([poly]),
  100,
  { pivot: pt }
);

// Different Geometry Inputs
rotate(poly, 100, { pivot: pt });
rotate(poly, 100, { pivot: pt.geometry });
rotate(poly.geometry, 100, { pivot: pt.geometry.coordinates });
rotate(featureCollection([poly]), 100, { pivot: pt.geometry });
rotate(featureCollection<Polygon | Point>([poly, pt]), 100, { pivot: pt });
rotate(geometryCollection([poly.geometry]).geometry, 100, {
  pivot: pt.geometry,
});
rotate(geometryCollection([poly.geometry]), 100, { pivot: pt.geometry });
rotate(geometryCollection([poly.geometry, pt.geometry]), 100, { pivot: pt });

// Allow mutating
rotate(poly, 100, { pivot: pt, mutate: true });
