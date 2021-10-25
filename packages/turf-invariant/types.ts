import * as helpers from "@turf/helpers";
import {
  GeometryCollection,
  LineString,
  Point,
  Polygon,
  Position,
} from "geojson";
import * as invariant from "./index";

/**
 * Fixtures
 */
const pt = helpers.point([0, 0]);
const line = helpers.lineString([
  [0, 0],
  [1, 1],
]);
const poly = helpers.polygon([
  [
    [0, 0],
    [1, 1],
    [2, 2],
    [0, 0],
  ],
]);
const gc = helpers.geometryCollection([
  pt.geometry,
  line.geometry,
  poly.geometry,
]);
const fc = helpers.featureCollection<Point | LineString | Polygon>([
  pt,
  line,
  poly,
]);

/**
 * invariant.getGeom
 */
// invariant.getGeom(fc); // Argument of type 'FeatureCollection<any>' is not assignable to parameter of type
const gcGeom: GeometryCollection = invariant.getGeom(gc);
const pointGeom: Point = invariant.getGeom(pt);
const lineGeom: LineString = invariant.getGeom(line);
const polyGeom: Polygon = invariant.getGeom(poly);

/**
 * invariant.getType
 */
const type = invariant.getType(pt);

/**
 * getCoord
 */
invariant.getCoord(pt);
invariant.getCoord(pt.geometry);
invariant.getCoord(pt.geometry.coordinates);
let coordZ = [10, 30, 2000];
coordZ = invariant.getCoord(coordZ);

/**
 * getCoords
 */
invariant.getCoords(pt.geometry)[0].toFixed();
invariant.getCoords(pt.geometry.coordinates)[0].toFixed();
invariant.getCoords(pt)[0].toFixed();
invariant.getCoords(line.geometry)[0][0].toFixed();
invariant.getCoords(line.geometry.coordinates)[0][0].toFixed();
invariant.getCoords(line)[0][0].toFixed();
invariant.getCoords(poly)[0][0][0].toFixed();
invariant.getCoords(poly.geometry)[0][0][0].toFixed();
invariant.getCoords(poly.geometry.coordinates)[0][0][0].toFixed();
const lineCoords: Position[] = [
  [10, 30],
  [40, 40],
];
invariant.getCoords(lineCoords)[0][0].toFixed();
