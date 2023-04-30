import { point, featureCollection } from "@turf/helpers";
import interpolate from "./";

const cellSize = 1;
const property = "pressure";
const gridType = "square";
const weight = 0.5;
const units = "miles";
const points = featureCollection([
  point([1, 2]),
  point([12, 13]),
  point([23, 22]),
]);

const grid = interpolate(points, cellSize, {
  gridType,
  property,
  units,
  weight,
});
grid.features[0].properties?.pressure;

// Optional properties
interpolate(points, cellSize, { gridType, property, units });
interpolate(points, cellSize, { gridType, property });
interpolate(points, cellSize, { gridType });
interpolate(points, cellSize, { gridType: "point" });
