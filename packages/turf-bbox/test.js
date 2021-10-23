const test = require("tape");
const {
  point,
  polygon,
  feature,
  lineString,
  multiPolygon,
  multiLineString,
  featureCollection,
} = require("@turf/helpers");
const bbox = require("./index").default;

// Fixtures
const pt = point([102.0, 0.5]);
const line = lineString([
  [102.0, -10.0],
  [103.0, 1.0],
  [104.0, 0.0],
  [130.0, 4.0],
]);
const poly = polygon([
  [
    [101.0, 0.0],
    [101.0, 1.0],
    [100.0, 1.0],
    [100.0, 0.0],
    [101.0, 0.0],
  ],
]);
const multiLine = multiLineString([
  [
    [100.0, 0.0],
    [101.0, 1.0],
  ],
  [
    [102.0, 2.0],
    [103.0, 3.0],
  ],
]);
const multiPoly = multiPolygon([
  [
    [
      [102.0, 2.0],
      [103.0, 2.0],
      [103.0, 3.0],
      [102.0, 3.0],
      [102.0, 2.0],
    ],
  ],
  [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0],
    ],
    [
      [100.2, 0.2],
      [100.8, 0.2],
      [100.8, 0.8],
      [100.2, 0.8],
      [100.2, 0.2],
    ],
  ],
]);
const fc = featureCollection([pt, line, poly, multiLine, multiPoly]);

test("bbox", (t) => {
  // FeatureCollection
  const fcBBox = bbox(fc);
  t.deepEqual(fcBBox, [100, -10, 130, 4], "featureCollection");

  // Point
  const ptBBox = bbox(pt);
  t.deepEqual(ptBBox, [102, 0.5, 102, 0.5], "point");

  // Line
  const lineBBox = bbox(line);
  t.deepEqual(lineBBox, [102, -10, 130, 4], "lineString");

  // Polygon
  const polyExtent = bbox(poly);
  t.deepEqual(polyExtent, [100, 0, 101, 1], "polygon");

  // MultiLineString
  const multiLineBBox = bbox(multiLine);
  t.deepEqual(multiLineBBox, [100, 0, 103, 3], "multiLineString");

  // MultiPolygon
  const multiPolyBBox = bbox(multiPoly);
  t.deepEqual(multiPolyBBox, [100, 0, 103, 3], "multiPolygon");

  t.deepEqual(bbox({ ...pt, bbox: [] }), [], "uses built-in bbox by default");
  t.deepEqual(
    bbox({ ...pt, bbox: [] }, { recompute: true }),
    [102, 0.5, 102, 0.5],
    "recomputes bbox with recompute option"
  );

  t.end();
});

test("bbox -- throws", (t) => {
  t.throws(
    () => bbox({}),
    /Unknown Geometry Type/,
    "unknown geometry type error"
  );
  t.end();
});

test("bbox -- null geometries", (t) => {
  t.deepEqual(bbox(feature(null)), [Infinity, Infinity, -Infinity, -Infinity]);
  t.end();
});
