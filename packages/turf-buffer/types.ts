import {
  point,
  lineString,
  polygon,
  multiPoint,
  multiLineString,
  multiPolygon,
  featureCollection,
  geometryCollection,
} from "@turf/helpers";
import { Point, LineString } from "geojson";
import buffer from "./";

// Standard Geometry
const pt = point([100, 0]);
const line = lineString([
  [100, 0],
  [50, 0],
]);
const poly = polygon([
  [
    [100, 0],
    [50, 0],
    [0, 50],
    [100, 0],
  ],
]);

buffer(pt, 5);
buffer(line, 5);
buffer(poly, 5);
buffer(pt, 5, { units: "miles" });
buffer(pt, 10, { units: "meters", steps: 64 });

// Multi Geometry
const multiPt = multiPoint([
  [100, 0],
  [0, 100],
]);
const multiLine = multiLineString([
  [
    [100, 0],
    [50, 0],
  ],
  [
    [100, 0],
    [50, 0],
  ],
]);
const multiPoly = multiPolygon([
  [
    [
      [100, 0],
      [50, 0],
      [0, 50],
      [100, 0],
    ],
  ],
  [
    [
      [100, 0],
      [50, 0],
      [0, 50],
      [100, 0],
    ],
  ],
]);

buffer(multiPt, 5);
buffer(multiLine, 5);
buffer(multiPoly, 5);

// Collections
const fc = featureCollection<Point | LineString>([pt, line]);
const gc = geometryCollection([pt.geometry, line.geometry]);

buffer(fc, 5);
buffer(gc, 5);

// Mixed Collections
const fcMixed = featureCollection<any>([pt, line, multiPt, multiLine]);
const gcMixed = geometryCollection([
  pt.geometry,
  line.geometry,
  multiPt.geometry,
  multiLine.geometry,
]);

buffer(fcMixed, 5);
buffer(gcMixed, 5);
