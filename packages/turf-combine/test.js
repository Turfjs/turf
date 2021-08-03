const test = require("tape");
const {
  point,
  multiPoint,
  polygon,
  multiPolygon,
  lineString,
  multiLineString,
  featureCollection,
} = require("@turf/helpers");
const combine = require("./index").default;

test("combine -- points", (t) => {
  // MultiPoint
  const pt1 = point([50, 51]);
  const pt2 = point([100, 101]);

  const multiPt = combine(featureCollection([pt1, pt2]));

  t.ok(multiPt, "should combine two Points into a MultiPoint");
  t.deepEqual(multiPt.features[0].geometry.coordinates, [
    [50, 51],
    [100, 101],
  ]);
  t.end();
});

test("combine -- mixed multiPoint & point", function (t) {
  // MultiPoint
  const pt1 = point([50, 51]);
  const pt2 = multiPoint([
    [100, 101],
    [101, 102],
  ]);

  const multiPt = combine(featureCollection([pt1, pt2]));

  t.ok(multiPt, "should combine Points + MultiPoint into a MultiPoint");
  t.deepEqual(multiPt.features[0].geometry.coordinates, [
    [50, 51],
    [100, 101],
    [101, 102],
  ]);
  t.end();
});

test("combine -- linestrings", function (t) {
  // MultiLineString
  const l1 = lineString([
    [102.0, -10.0],
    [130.0, 4.0],
  ]);
  const l2 = lineString([
    [40.0, -20.0],
    [150.0, 18.0],
  ]);

  const multiLine = combine(featureCollection([l1, l2]));

  t.ok(multiLine, "should combine two LineStrings into a MultiLineString");
  t.equal(multiLine.features[0].geometry.type, "MultiLineString");
  t.deepEqual(multiLine.features[0].geometry.coordinates, [
    [
      [102, -10],
      [130, 4],
    ],
    [
      [40, -20],
      [150, 18],
    ],
  ]);
  t.end();
});

test("combine -- mixed multiLineString & linestring", function (t) {
  // MultiLineString
  const l1 = lineString([
    [102.0, -10.0],
    [130.0, 4.0],
  ]);
  const l2 = multiLineString([
    [
      [40.0, -20.0],
      [150.0, 18.0],
    ],
    [
      [50, -10],
      [160, 28],
    ],
  ]);

  const multiLine = combine(featureCollection([l1, l2]));

  t.ok(
    multiLine,
    "should combine LineString + MultiLineString into a MultiLineString"
  );
  t.equal(multiLine.features[0].geometry.type, "MultiLineString");
  t.deepEqual(multiLine.features[0].geometry.coordinates, [
    [
      [102, -10],
      [130, 4],
    ],
    [
      [40, -20],
      [150, 18],
    ],
    [
      [50, -10],
      [160, 28],
    ],
  ]);
  t.end();
});

test("combine -- polygons", function (t) {
  // MultiPolygon
  const p1 = polygon([
    [
      [20.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0],
      [20.0, 0.0],
    ],
  ]);
  const p2 = polygon([
    [
      [30.0, 0.0],
      [102.0, 0.0],
      [103.0, 1.0],
      [30.0, 0.0],
    ],
  ]);
  const multiPoly = combine(featureCollection([p1, p2]));

  t.ok(multiPoly, "should combine two Polygons into a MultiPolygon");
  t.equal(multiPoly.features[0].geometry.type, "MultiPolygon");
  t.deepEqual(multiPoly.features[0].geometry.coordinates, [
    [
      [
        [20, 0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0],
        [20, 0],
      ],
    ],
    [
      [
        [30.0, 0.0],
        [102.0, 0.0],
        [103.0, 1.0],
        [30.0, 0.0],
      ],
    ],
  ]);

  t.end();
});

test("combine -- polygons", function (t) {
  // MultiPolygon
  const p1 = polygon([
    [
      [20.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0],
      [20.0, 0.0],
    ],
  ]);
  const p2 = multiPolygon([
    [
      [
        [30.0, 0.0],
        [102.0, 0.0],
        [103.0, 1.0],
        [30.0, 0.0],
      ],
    ],
    [
      [
        [20.0, 5.0],
        [92.0, 5.0],
        [93.0, 6.0],
        [20.0, 5.0],
      ],
      [
        [25, 5],
        [30, 5],
        [30, 5.5],
        [25, 5],
      ],
    ],
  ]);
  const multiPoly = combine(featureCollection([p1, p2]));

  t.ok(
    multiPoly,
    "should combine two Polygon + MultiPolygon into a MultiPolygon"
  );
  t.equal(multiPoly.features[0].geometry.type, "MultiPolygon");
  t.deepEqual(multiPoly.features[0].geometry.coordinates, [
    [
      [
        [20, 0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0],
        [20, 0],
      ],
    ],
    [
      [
        [30.0, 0.0],
        [102.0, 0.0],
        [103.0, 1.0],
        [30.0, 0.0],
      ],
    ],
    [
      [
        [20.0, 5.0],
        [92.0, 5.0],
        [93.0, 6.0],
        [20.0, 5.0],
      ],
      [
        [25, 5],
        [30, 5],
        [30, 5.5],
        [25, 5],
      ],
    ],
  ]);

  t.end();
});

test("combine -- heterogenous", function (t) {
  // MultiPolygon
  const p1 = polygon([
    [
      [20.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0],
      [20.0, 0.0],
    ],
  ]);
  const p2 = multiPolygon([
    [
      [
        [30.0, 0.0],
        [102.0, 0.0],
        [103.0, 1.0],
        [30.0, 0.0],
      ],
    ],
    [
      [
        [20.0, 5.0],
        [92.0, 5.0],
        [93.0, 6.0],
        [20.0, 5.0],
      ],
      [
        [25, 5],
        [30, 5],
        [30, 5.5],
        [25, 5],
      ],
    ],
  ]);
  const pt1 = point([50, 51]);
  const multiPoly = combine(featureCollection([p1, p2, pt1]));

  t.ok(
    multiPoly,
    "should combine two Polygon + MultiPolygon into a MultiPolygon"
  );
  t.equal(multiPoly.features[0].geometry.type, "MultiPoint");

  t.equal(multiPoly.features[1].geometry.type, "MultiPolygon");
  t.deepEqual(multiPoly.features[1].geometry.coordinates, [
    [
      [
        [20, 0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0],
        [20, 0],
      ],
    ],
    [
      [
        [30.0, 0.0],
        [102.0, 0.0],
        [103.0, 1.0],
        [30.0, 0.0],
      ],
    ],
    [
      [
        [20.0, 5.0],
        [92.0, 5.0],
        [93.0, 6.0],
        [20.0, 5.0],
      ],
      [
        [25, 5],
        [30, 5],
        [30, 5.5],
        [25, 5],
      ],
    ],
  ]);

  t.end();
});
