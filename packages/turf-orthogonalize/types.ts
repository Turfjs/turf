import { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { featureCollection, multiPolygon, polygon } from "@turf/helpers";
import { orthogonalize } from "./index.js";

const poly = polygon([
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 0],
  ],
]);
const multiPoly = multiPolygon([poly.geometry.coordinates]);

// Returns the input type
const squaredFeature: Feature<Polygon> = orthogonalize(poly);
const squaredMultiFeature: Feature<MultiPolygon> = orthogonalize(multiPoly);
const squaredGeometry: Polygon = orthogonalize(poly.geometry, {
  thresholdDegrees: 10,
});
const squaredMultiGeometry: MultiPolygon = orthogonalize(multiPoly.geometry);
const squaredCollection: FeatureCollection = orthogonalize(
  featureCollection<Polygon | MultiPolygon>([poly, multiPoly])
);
