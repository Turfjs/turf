import { Point, MultiPoint } from "geojson";
import pointsWithinPolygon from "./";
import { points, polygon, multiPoint, featureCollection } from "@turf/helpers";

const pts = points([
  [-46.6318, -23.5523],
  [-46.6246, -23.5325],
  [-46.6062, -23.5513],
  [-46.663, -23.554],
  [-46.643, -23.557],
]);
const mpt1 = multiPoint(
  [
    [50, 50],
    [100, 100],
  ],
  {}
);
const mpt2 = multiPoint(
  [
    [75, 75],
    [150, 150],
  ],
  {}
);
const mpts = featureCollection([mpt1, mpt2]);

const searchWithin = polygon([
  [
    [-46.653, -23.543],
    [-46.634, -23.5346],
    [-46.613, -23.543],
    [-46.614, -23.559],
    [-46.631, -23.567],
    [-46.653, -23.56],
    [-46.653, -23.543],
  ],
]);
const ptsWithin = pointsWithinPolygon(pts, searchWithin);
const mptsWithin = pointsWithinPolygon(mpts, searchWithin);

// Accepts a mixture of Point and MultiPoint
const mix = featureCollection<Point | MultiPoint>([...pts.features, mpt1]);
const mixWithin = pointsWithinPolygon(mix, searchWithin);
