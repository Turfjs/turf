import {
  geometryCollection,
  featureCollection,
  point,
  lineString,
} from "@turf/helpers";
import nearestPointToLine from "./index";

const points = featureCollection([point([0, 0]), point([0.5, 0.5])]);
const line = lineString([
  [1, 1],
  [-1, 1],
]);

const nearest = nearestPointToLine<{ foo: string; dist: number }>(
  points,
  line,
  { properties: { foo: "bar" } }
);
nearest.properties.foo;
nearest.properties.dist;
// nearest.properties.bar // [ts] Property 'bar' does not exist on type '{ dist?: number; foo: string; }'.

// GeometryCollection
const geomPoints = geometryCollection([
  point([0, 0]).geometry,
  point([0.5, 0.5]).geometry,
]);
nearestPointToLine(geomPoints, line);
