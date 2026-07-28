import { buffer } from "../index.js";
import {
  featureCollection,
  geometryCollection,
  lineString,
  multiLineString,
  multiPoint,
  multiPolygon,
  point,
  polygon,
} from "@turf/helpers";
import type {
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Polygon,
  MultiPolygon,
} from "geojson";

import { expect } from "tstyche";

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

// Collections
const fc = featureCollection<Point | LineString>([pt, line]);
const gc = geometryCollection([pt.geometry, line.geometry]);

// Mixed Collections
const fcMixed = featureCollection<any>([pt, line, multiPt, multiLine]);
const gcMixed = geometryCollection([
  pt.geometry,
  line.geometry,
  multiPt.geometry,
  multiLine.geometry,
]);

/**
 * If the syntax below starts generating errors it's possible you've narrowed
 * the input arguments which is likely to be a breaking change.
 */
// Standard Geometry
expect(buffer).type.toBeCallableWith(pt, 5);
expect(buffer).type.toBeCallableWith(line, 5);
expect(buffer).type.toBeCallableWith(poly, 5);
expect(buffer).type.toBeCallableWith(pt, 5, { units: "miles" });
expect(buffer).type.toBeCallableWith(pt, 10, { units: "meters", steps: 64 });

// Multi Geometry
expect(buffer).type.toBeCallableWith(multiPt, 5);
expect(buffer).type.toBeCallableWith(multiLine, 5);
expect(buffer).type.toBeCallableWith(multiPoly, 5);

// Collections
expect(buffer).type.toBeCallableWith(fc, 5);
expect(buffer).type.toBeCallableWith(gc, 5);

// Mixed Collections
expect(buffer).type.toBeCallableWith(fcMixed, 5);
expect(buffer).type.toBeCallableWith(gcMixed, 5);

/**
 * If the sytax in this section starts generating errors, it's possible you've
 * broadened the return type which is likely to be a breaking change.
 */
expect(buffer(line)).type.toBe<Feature<Polygon | MultiPolygon> | undefined>();

expect(buffer(fc)).type.toBe<
  FeatureCollection<Polygon | MultiPolygon> | undefined
>();
