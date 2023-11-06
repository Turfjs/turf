const test = require("tape");
const {
  point,
  polygon,
  lineString,
  feature,
  featureCollection,
  geometryCollection,
  multiLineString,
  multiPoint,
  multiPolygon,
  radiansToLength,
  lengthToRadians,
  lengthToDegrees,
  radiansToDegrees,
  degreesToRadians,
  bearingToAzimuth,
  convertLength,
  convertArea,
  round,
  isObject,
  isNumber,
  earthRadius,
} = require("./index");
const turf = require("./index");

test("point", (t) => {
  const ptArray = point([5, 10], { name: "test point" });

  t.ok(ptArray);
  t.equal(ptArray.geometry.coordinates[0], 5);
  t.equal(ptArray.geometry.coordinates[1], 10);
  t.equal(ptArray.properties.name, "test point");

  // t.throws(() => {
  //     point('hey', 'invalid');
  // }, 'numbers required');

  const noProps = point([0, 0]);
  t.deepEqual(noProps.properties, {}, "no props becomes {}");

  t.throws(() => {
    point("hello");
  }, "Issue #1941 - point rejects invalid coordinate arg");

  t.end();
});

test("polygon", (t) => {
  const poly = polygon(
    [
      [
        [5, 10],
        [20, 40],
        [40, 0],
        [5, 10],
      ],
    ],
    { name: "test polygon" }
  );
  t.ok(poly);
  t.equal(poly.geometry.coordinates[0][0][0], 5);
  t.equal(poly.geometry.coordinates[0][1][0], 20);
  t.equal(poly.geometry.coordinates[0][2][0], 40);
  t.equal(poly.properties.name, "test polygon");
  t.equal(poly.geometry.type, "Polygon");
  t.throws(
    () => {
      t.equal(
        polygon([
          [
            [20.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0],
          ],
        ]).message
      );
    },
    /First and last Position are not equivalent/,
    "invalid ring - not wrapped"
  );
  t.throws(
    () => {
      t.equal(
        polygon([
          [
            [1, 2, 3],
            [4, 5],
            [6, 7],
            [1, 2],
          ],
        ]).message
      );
    },
    /First and last Position are not equivalent/,
    "invalid ring - z coordinate"
  );
  t.throws(
    () => {
      t.equal(
        polygon([
          [
            [1, 2],
            [4, 5],
            [6, 7],
            [1, 2, 3],
          ],
        ]).message
      );
    },
    /First and last Position are not equivalent/,
    "invalid ring - z coordinate #2"
  );
  t.throws(
    () => {
      t.equal(
        polygon([
          [
            [20.0, 0.0],
            [101.0, 0.0],
          ],
        ]).message
      );
    },
    /Each LinearRing of a Polygon must have 4 or more Positions/,
    "invalid ring - too few positions"
  );
  const noProperties = polygon([
    [
      [5, 10],
      [20, 40],
      [40, 0],
      [5, 10],
    ],
  ]);
  t.deepEqual(noProperties.properties, {});
  t.end();
});

test("lineString", (t) => {
  const line = lineString(
    [
      [5, 10],
      [20, 40],
    ],
    { name: "test line" }
  );
  t.ok(line, "creates a linestring");
  t.equal(line.geometry.coordinates[0][0], 5);
  t.equal(line.geometry.coordinates[1][0], 20);
  t.equal(line.properties.name, "test line");
  t.deepEqual(
    lineString([
      [5, 10],
      [20, 40],
    ]).properties,
    {},
    "no properties case"
  );

  t.throws(() => lineString(), "error on no coordinates");
  t.throws(
    () => lineString([[5, 10]]),
    "coordinates must be an array of two or more positions"
  );
  t.throws(() => lineString([["xyz", 10]]), "coordinates must contain numbers");
  t.throws(() => lineString([[5, "xyz"]]), "coordinates must contain numbers");
  t.end();
});

test("featureCollection", (t) => {
  const p1 = point([0, 0], { name: "first point" });
  const p2 = point([0, 10]);
  const p3 = point([10, 10]);
  const p4 = point([10, 0]);
  const fc = featureCollection([p1, p2, p3, p4]);
  t.ok(fc);
  t.equal(fc.features.length, 4);
  t.equal(fc.features[0].properties.name, "first point");
  t.equal(fc.type, "FeatureCollection");
  t.equal(fc.features[1].geometry.type, "Point");
  t.equal(fc.features[1].geometry.coordinates[0], 0);
  t.equal(fc.features[1].geometry.coordinates[1], 10);
  // t.throws(() => featureCollection(fc), /features must be an Array/);
  // t.throws(() => featureCollection(p1), /features must be an Array/);
  t.end();
});

test("multilinestring", (t) => {
  t.deepEqual(
    multiLineString([
      [
        [0, 0],
        [10, 10],
      ],
      [
        [5, 0],
        [15, 8],
      ],
    ]),
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [0, 0],
            [10, 10],
          ],
          [
            [5, 0],
            [15, 8],
          ],
        ],
      },
    },
    "takes coordinates"
  );

  t.deepEqual(
    multiLineString(
      [
        [
          [0, 0],
          [10, 10],
        ],
        [
          [5, 0],
          [15, 8],
        ],
      ],
      { test: 23 }
    ),
    {
      type: "Feature",
      properties: {
        test: 23,
      },
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [0, 0],
            [10, 10],
          ],
          [
            [5, 0],
            [15, 8],
          ],
        ],
      },
    },
    "takes properties"
  );

  // t.throws(() => {
  //     multiLineString();
  // }, 'throws error with no coordinates');

  t.end();
});

test("multiPoint", (t) => {
  t.deepEqual(
    multiPoint([
      [0, 0],
      [10, 10],
    ]),
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPoint",
        coordinates: [
          [0, 0],
          [10, 10],
        ],
      },
    },
    "takes coordinates"
  );

  t.deepEqual(
    multiPoint(
      [
        [0, 0],
        [10, 10],
      ],
      { test: 23 }
    ),
    {
      type: "Feature",
      properties: {
        test: 23,
      },
      geometry: {
        type: "MultiPoint",
        coordinates: [
          [0, 0],
          [10, 10],
        ],
      },
    },
    "takes properties"
  );

  // t.throws(() => {
  //     multiPoint();
  // }, 'throws error with no coordinates');

  t.end();
});

test("multipolygon", (t) => {
  t.deepEqual(
    multiPolygon([
      [
        [
          [94, 57],
          [78, 49],
          [94, 43],
          [94, 57],
        ],
      ],
      [
        [
          [93, 19],
          [63, 7],
          [79, 0],
          [93, 19],
        ],
      ],
    ]),
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [94, 57],
              [78, 49],
              [94, 43],
              [94, 57],
            ],
          ],
          [
            [
              [93, 19],
              [63, 7],
              [79, 0],
              [93, 19],
            ],
          ],
        ],
      },
    },
    "takes coordinates"
  );

  t.deepEqual(
    multiPolygon(
      [
        [
          [
            [94, 57],
            [78, 49],
            [94, 43],
            [94, 57],
          ],
        ],
        [
          [
            [93, 19],
            [63, 7],
            [79, 0],
            [93, 19],
          ],
        ],
      ],
      { test: 23 }
    ),
    {
      type: "Feature",
      properties: {
        test: 23,
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [94, 57],
              [78, 49],
              [94, 43],
              [94, 57],
            ],
          ],
          [
            [
              [93, 19],
              [63, 7],
              [79, 0],
              [93, 19],
            ],
          ],
        ],
      },
    },
    "takes properties"
  );

  // t.throws(() => {
  //     multiPolygon();
  // }, 'throws error with no coordinates');

  t.end();
});

test("geometrycollection", (t) => {
  const pt = {
    type: "Point",
    coordinates: [100, 0],
  };
  const line = {
    type: "LineString",
    coordinates: [
      [101, 0],
      [102, 1],
    ],
  };
  const gc = geometryCollection([pt, line]);

  t.deepEqual(
    gc,
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Point",
            coordinates: [100, 0],
          },
          {
            type: "LineString",
            coordinates: [
              [101, 0],
              [102, 1],
            ],
          },
        ],
      },
    },
    "creates a GeometryCollection"
  );

  const gcWithProps = geometryCollection([pt, line], { a: 23 });
  t.deepEqual(
    gcWithProps,
    {
      type: "Feature",
      properties: { a: 23 },
      geometry: {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Point",
            coordinates: [100, 0],
          },
          {
            type: "LineString",
            coordinates: [
              [101, 0],
              [102, 1],
            ],
          },
        ],
      },
    },
    "creates a GeometryCollection with properties"
  );

  t.end();
});

test("radiansToLength", (t) => {
  t.equal(radiansToLength(1, "radians"), 1);
  t.equal(radiansToLength(1, "kilometers"), earthRadius / 1000);
  t.equal(radiansToLength(1, "miles"), earthRadius / 1609.344);
  // t.throws(() => radiansToLength(1, 'foo'), 'invalid units');
  t.end();
});

test("lengthToRadians", (t) => {
  t.equal(lengthToRadians(1, "radians"), 1);
  t.equal(lengthToRadians(earthRadius / 1000, "kilometers"), 1);
  t.equal(lengthToRadians(earthRadius / 1609.344, "miles"), 1);
  // t.throws(() => lengthToRadians(1, 'foo'), 'invalid units');
  t.end();
});

test("lengthToDegrees", (t) => {
  t.equal(lengthToDegrees(1, "radians"), 57.29577951308232);
  t.equal(lengthToDegrees(100, "kilometers"), 0.899320363724538);
  t.equal(lengthToDegrees(10, "miles"), 0.1447315831437903);
  // t.throws(() => lengthToRadians(1, 'foo'), 'invalid units');
  t.end();
});

test("radiansToDegrees", (t) => {
  t.equal(
    round(radiansToDegrees(Math.PI / 3), 6),
    60,
    "radiance conversion PI/3"
  );
  t.equal(radiansToDegrees(3.5 * Math.PI), 270, "radiance conversion 3.5PI");
  t.equal(radiansToDegrees(-Math.PI), -180, "radiance conversion -PI");
  t.end();
});

test("degreesToRadians", (t) => {
  t.equal(degreesToRadians(60), Math.PI / 3, "degrees conversion 60");
  t.equal(degreesToRadians(270), 1.5 * Math.PI, "degrees conversion 270");
  t.equal(degreesToRadians(-180), -Math.PI, "degrees conversion -180");
  t.end();
});

test("bearingToAzimuth", (t) => {
  t.equal(bearingToAzimuth(40), 40);
  t.equal(bearingToAzimuth(-105), 255);
  t.equal(bearingToAzimuth(410), 50);
  t.equal(bearingToAzimuth(-200), 160);
  t.equal(bearingToAzimuth(-395), 325);
  t.end();
});

test("round", (t) => {
  t.equal(round(125.123), 125);
  t.equal(round(123.123, 1), 123.1);
  t.equal(round(123.5), 124);
  t.throws(() => round(34.5, "precision"), "invalid precision");
  t.throws(() => round(34.5, -5), "invalid precision");
  t.end();
});

test("convertLength", (t) => {
  t.equal(convertLength(1000, "meters"), 1);
  t.equal(convertLength(1000, "meters", "kilometers"), 1);
  t.equal(convertLength(1, "kilometers", "miles"), 0.621371192237334);
  t.equal(convertLength(1, "miles", "kilometers"), 1.609344);
  t.equal(convertLength(1, "nauticalmiles"), 1.852);
  t.equal(convertLength(1, "meters", "centimeters"), 100.00000000000001);
  t.equal(convertLength(1, "meters", "yards"), 1.0936);
  t.equal(convertLength(1, "yards", "meters"), 0.91441111923921);
  // t.throws(() => convertLength(1, 'foo'), 'invalid units');

  t.equal(
    convertLength(Math.PI, "radians", "degrees"),
    180,
    "PI Radians is 180 degrees"
  );
  t.equal(
    convertLength(180, "degrees", "radians"),
    Math.PI,
    "180 Degrees is PI Radians"
  );
  t.end();
});

test("convertArea", (t) => {
  t.equal(convertArea(1000), 0.001);
  t.equal(convertArea(1, "kilometres", "miles"), 0.386);
  t.equal(convertArea(1, "miles", "kilometers"), 2.5906735751295336);
  t.equal(convertArea(1, "meters", "centimetres"), 10000);
  t.equal(convertArea(100, "metres", "acres"), 0.0247105);
  t.equal(convertArea(100, undefined, "yards"), 119.59900459999999);
  t.equal(convertArea(100, "metres", "feet"), 1076.3910417);
  t.equal(convertArea(100000, "feet", undefined), 0.009290303999749462);
  t.equal(convertArea(1, "meters", "hectares"), 0.0001);
  // t.throws(() => convertLength(1, 'foo'), 'invalid original units');
  // t.throws(() => convertLength(1, 'meters', 'foo'), 'invalid final units');

  t.end();
});

// https://github.com/Turfjs/turf/issues/853
// https://github.com/Turfjs/turf/pull/866#discussion_r129873661
test("null geometries", (t) => {
  t.equal(feature(null).geometry, null, "feature");
  t.equal(
    featureCollection([feature(null)]).features[0].geometry,
    null,
    "featureCollection"
  );
  t.equal(
    geometryCollection([feature(null).geometry]).geometry.geometries[0],
    null,
    "geometryCollection"
  );
  t.equal(
    geometryCollection([]).geometry.geometries.length,
    0,
    "geometryCollection -- empty"
  );
  t.end();
});

test("turf-helpers -- Handle Id & BBox properties", (t) => {
  const id = 12345;
  const bbox = [10, 30, 10, 30];
  const pt = point([10, 30], {}, { bbox, id });
  const ptId0 = point([10, 30], {}, { bbox, id: 0 });
  const fc = featureCollection([pt], { bbox, id });
  t.equal(pt.id, id, "feature id");
  t.equal(ptId0.id, 0, "feature id = 0"); // issue #1180
  t.equal(pt.bbox, bbox, "feature bbox");
  t.equal(fc.id, id, "featureCollection id");
  t.equal(fc.bbox, bbox, "featureCollection bbox");
  // t.throws(() => point([10, 30], {}, {bbox: [0], id}), 'throws invalid bbox');
  // t.throws(() => point([10, 30], {}, {bbox, id: {invalid: 'id'}}), 'throws invalid id');
  // t.throws(() => featureCollection([pt], {bbox: [0], id}), 'throws invalid bbox');
  // t.throws(() => featureCollection([pt], {bbox: [0], id: {invalid: 'id'}}), 'throws invalid id');
  t.end();
});

test("turf-helpers -- isNumber", (t) => {
  // t.throws(() => point(['foo', 'bar']), /coordinates must contain numbers/, 'coordinates must contain numbers');
  // t.throws(() => lineString([['foo', 'bar'], ['hello', 'world']]), /coordinates must contain numbers/, 'coordinates must contain numbers');
  // t.throws(() => polygon([[['foo', 'bar'], ['hello', 'world'], ['world', 'hello'], ['foo', 'bar']]]), /coordinates must contain numbers/, 'coordinates must contain numbers');

  // true
  t.true(isNumber(123));
  t.true(isNumber(1.23));
  t.true(isNumber(-1.23));
  t.true(isNumber(-123));
  t.true(isNumber("123"));
  t.true(isNumber(+"123"));
  t.true(isNumber("1e10000"));
  t.true(isNumber(1e100));
  t.true(isNumber(Infinity));
  t.true(isNumber(-Infinity));

  // false
  t.false(isNumber(+"ciao"));
  t.false(isNumber("foo"));
  t.false(isNumber("10px"));
  t.false(isNumber(NaN));
  t.false(isNumber(undefined));
  t.false(isNumber(null));
  t.false(isNumber({ a: 1 }));
  t.false(isNumber({}));
  t.false(isNumber([1, 2, 3]));
  t.false(isNumber([]));
  t.false(isNumber(isNumber));
  t.end();
});

test("turf-helpers -- isObject", (t) => {
  // true
  t.true(isObject({ a: 1 }));
  t.true(isObject({}));
  t.true(point([0, 1]));
  t.true(isObject(new Object()));

  // false
  t.false(isObject(123));
  t.false(isObject(Infinity));
  t.false(isObject(-123));
  t.false(isObject("foo"));
  t.false(isObject(NaN));
  t.false(isObject(undefined));
  t.false(isObject(null));
  t.false(isObject([1, 2, 3]));
  t.false(isObject([]));
  t.false(isObject(isNumber));
  t.false(
    isObject(function () {
      /*noop*/
    })
  );
  t.end();
});

test("turf-helpers -- points", (t) => {
  const points = turf.points(
    [
      [-75, 39],
      [-80, 45],
      [-78, 50],
    ],
    { foo: "bar" },
    { id: "hello" }
  );

  t.equal(points.features.length, 3);
  t.equal(points.id, "hello");
  t.equal(points.features[0].properties.foo, "bar");
  t.end();
});

test("turf-helpers -- lineStrings", (t) => {
  var linestrings = turf.lineStrings(
    [
      [
        [-24, 63],
        [-23, 60],
        [-25, 65],
        [-20, 69],
      ],
      [
        [-14, 43],
        [-13, 40],
        [-15, 45],
        [-10, 49],
      ],
    ],
    { foo: "bar" },
    { id: "hello" }
  );

  t.equal(linestrings.features.length, 2);
  t.equal(linestrings.id, "hello");
  t.equal(linestrings.features[0].properties.foo, "bar");
  t.end();
});

test("turf-helpers -- polygons", (t) => {
  var polygons = turf.polygons(
    [
      [
        [
          [-5, 52],
          [-4, 56],
          [-2, 51],
          [-7, 54],
          [-5, 52],
        ],
      ],
      [
        [
          [-15, 42],
          [-14, 46],
          [-12, 41],
          [-17, 44],
          [-15, 42],
        ],
      ],
    ],
    { foo: "bar" },
    { id: "hello" }
  );

  t.equal(polygons.features.length, 2);
  t.equal(polygons.id, "hello");
  t.equal(polygons.features[0].properties.foo, "bar");
  t.end();
});

test("turf-helpers -- Issue #1284 - Prevent mutating Properties", (t) => {
  // https://github.com/Turfjs/turf/issues/1284
  const coord = [110, 45];
  const properties = { foo: "bar" };

  // Create initial Feature
  const pt = feature(coord, properties);
  t.deepEqual(pt.properties, { foo: "bar" });
  t.deepEqual(properties, { foo: "bar" });

  // Mutate Original Properties
  properties.foo = "barbar";

  // Initial Point's Properties ~should~ be mutated
  // https://github.com/Turfjs/turf/commit/39c6c9ec29986cc540960b3e2680e9e0a65168a1#r28018260
  t.deepEqual(pt.properties, { foo: "barbar" });
  t.deepEqual(properties, { foo: "barbar" });

  // Include this test case if initial point should ~not~ have it's properties mutated
  t.skip(pt.properties, { foo: "bar" });

  // Create Mutated Point
  const ptMutate = feature(coord, properties);
  t.deepEqual(ptMutate.properties, { foo: "barbar" });
  t.deepEqual(properties, { foo: "barbar" });

  // New Features should contain empty properties {}
  t.deepEqual(feature(coord).properties, {});
  t.end();
});
