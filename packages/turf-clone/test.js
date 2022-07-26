const test = require("tape");
const {
  point,
  lineString,
  polygon,
  featureCollection,
  geometryCollection,
} = require("@turf/helpers");
const { coordEach } = require("@turf/meta");
const clone = require("./index").default;

test("turf-clone", (t) => {
  // Define Features
  const pt = point([0, 20]);
  const line = lineString([
    [10, 40],
    [0, 20],
  ]);
  const poly = polygon([
    [
      [10, 40],
      [0, 20],
      [20, 0],
      [10, 40],
    ],
  ]);
  const fc = featureCollection([
    point([0, 20]),
    lineString([
      [10, 40],
      [0, 20],
    ]),
    polygon([
      [
        [10, 40],
        [0, 20],
        [20, 0],
        [10, 40],
      ],
    ]),
  ]);
  const gc = geometryCollection([
    point([0, 20]).geometry,
    lineString([
      [10, 40],
      [0, 20],
    ]).geometry,
    polygon([
      [
        [10, 40],
        [0, 20],
        [20, 0],
        [10, 40],
      ],
    ]).geometry,
  ]).geometry;

  // Clone Features
  const ptCloned = clone(pt);
  const lineCloned = clone(line);
  const polyCloned = clone(poly, true);
  const fcCloned = clone(fc);
  const gcCloned = clone(gc);

  // Apply Mutation
  ptCloned.geometry.coordinates.reverse();
  lineCloned.geometry.coordinates.reverse();
  polyCloned.geometry.coordinates.reverse();
  coordEach(fcCloned, (coord) => coord.reverse());
  coordEach(gcCloned, (coord) => coord.reverse());

  // Original Geometries should not be mutated
  t.deepEqual(pt.geometry.coordinates, [0, 20], "point");
  t.deepEqual(
    line.geometry.coordinates,
    [
      [10, 40],
      [0, 20],
    ],
    "lineString"
  );
  t.deepEqual(
    poly.geometry.coordinates,
    [
      [
        [10, 40],
        [0, 20],
        [20, 0],
        [10, 40],
      ],
    ],
    "polygon"
  );

  // Feature Collection
  t.deepEqual(fc.features[0].geometry.coordinates, [0, 20], "fc - point");
  t.deepEqual(
    fc.features[1].geometry.coordinates,
    [
      [10, 40],
      [0, 20],
    ],
    "fc - lineString"
  );
  t.deepEqual(
    fc.features[2].geometry.coordinates,
    [
      [
        [10, 40],
        [0, 20],
        [20, 0],
        [10, 40],
      ],
    ],
    "fc - polygon"
  );

  // Geometry Collection
  t.deepEqual(gc.geometries[0].coordinates, [0, 20], "gc - point");
  t.deepEqual(
    gc.geometries[1].coordinates,
    [
      [10, 40],
      [0, 20],
    ],
    "gc - lineString"
  );
  t.deepEqual(
    gc.geometries[2].coordinates,
    [
      [
        [10, 40],
        [0, 20],
        [20, 0],
        [10, 40],
      ],
    ],
    "gc - polygon"
  );
  t.end();
});

test("turf-clone -- throws", (t) => {
  t.throws(() => clone(), /geojson is required/);
  t.end();
});

test("turf-clone -- optional properties", (t) => {
  const pt = point([0, 20]);
  pt.properties = undefined;
  pt.id = 300;
  pt.bbox = [0, 20, 0, 20];

  const ptCloned = clone(pt);
  t.deepEqual(ptCloned.bbox, [0, 20, 0, 20]);
  t.equal(ptCloned.id, 300);
  t.end();
});

test("turf-clone -- Geometry Objects", (t) => {
  const pt = point([0, 20]).geometry;
  const line = lineString([
    [10, 40],
    [0, 20],
  ]).geometry;
  const poly = polygon([
    [
      [10, 40],
      [0, 20],
      [20, 0],
      [10, 40],
    ],
  ]).geometry;

  const ptCloned = clone(pt);
  const lineCloned = clone(line);
  const polyCloned = clone(poly);

  ptCloned.coordinates.reverse();
  lineCloned.coordinates.reverse();
  polyCloned.coordinates.reverse();

  t.deepEqual(pt.coordinates, [0, 20], "geometry point");
  t.deepEqual(
    line.coordinates,
    [
      [10, 40],
      [0, 20],
    ],
    "geometry line"
  );
  t.deepEqual(
    poly.coordinates,
    [
      [
        [10, 40],
        [0, 20],
        [20, 0],
        [10, 40],
      ],
    ],
    "geometry polygon"
  );
  t.end();
});

test("turf-clone -- Preserve Foreign Members -- Feature", (t) => {
  const properties = { foo: "bar" };
  const bbox = [0, 20, 0, 20];
  const id = 12345;
  const pt = point([0, 20], properties, { bbox, id });
  pt.custom = "foreign members";

  const cloned = clone(pt);
  t.equal(cloned.id, id);
  t.equal(cloned.custom, pt.custom);
  t.deepEqual(cloned.bbox, bbox);
  t.deepEqual(cloned.properties, properties);
  t.end();
});

test("turf-clone -- Preserve Foreign Members -- FeatureCollection", (t) => {
  const properties = { foo: "bar" };
  const bbox = [0, 20, 0, 20];
  const id = 12345;
  const fc = featureCollection([point([0, 20])], { bbox, id });
  fc.custom = "foreign members";
  fc.properties = properties;

  const cloned = clone(fc);
  t.equal(cloned.id, id);
  t.equal(cloned.custom, fc.custom);
  t.deepEqual(cloned.bbox, bbox);
  t.deepEqual(cloned.properties, properties);
  t.end();
});

test("turf-clone -- Preserve all properties -- Feature", (t) => {
  const id = 12345;
  const bbox = [0, 20, 0, 20];
  const properties = {
    foo: "bar",
    object: { property: 1 },
    array: [0, 1, 2],
    number: 1,
    nullity: null,
    boolean: true,
  };
  const pt = point([0, 20], properties, { bbox, id });
  pt.hello = "world"; // Foreign member

  // Clone and mutate
  const cloned = clone(pt);

  // Clone properly translated all properties
  t.equal(cloned.hello, "world");
  t.equal(cloned.properties.foo, "bar");
  t.equal(cloned.id, 12345);
  t.deepEqual(cloned.bbox, [0, 20, 0, 20]);
  t.equal(cloned.properties.object.property, 1);
  t.deepEqual(cloned.properties.array, [0, 1, 2]);
  t.equal(cloned.properties.number, 1);
  t.equal(cloned.properties.nullity, null);
  t.equal(cloned.properties.boolean, true);

  // Mutate clone properties
  cloned["hello"] = "universe";
  cloned.properties["foo"] = "foo";
  cloned["id"] = 54321;
  cloned["bbox"] = [30, 40, 30, 40];
  cloned.properties.object["property"] = 2;
  cloned.properties.array[0] = 500;
  cloned.properties.number = -99;
  cloned.properties.boolean = false;

  // Test if original point hasn't been mutated
  t.equal(pt.hello, "world");
  t.equal(pt.properties.foo, "bar");
  t.equal(pt.id, 12345);
  t.deepEqual(pt.bbox, [0, 20, 0, 20]);
  t.equal(pt.properties.object.property, 1);
  t.deepEqual(pt.properties.array, [0, 1, 2]);
  t.equal(pt.properties.number, 1);
  t.equal(pt.properties.boolean, true);
  t.end();
});

test("turf-clone -- Preserve all properties -- FeatureCollection", (t) => {
  const bbox = [0, 20, 0, 20];
  const id = 12345;
  const fc = featureCollection([point([0, 20])], { bbox, id });
  fc.hello = "world"; // Foreign member

  // Clone and mutate
  const cloned = clone(fc);
  cloned["hello"] = "universe";
  cloned["id"] = 54321;
  cloned["bbox"] = [30, 40, 30, 40];

  t.equal(fc.hello, "world");
  t.equal(fc.id, 12345);
  t.deepEqual(fc.bbox, [0, 20, 0, 20]);
  t.end();
});

test("turf-clone -- Feature with null geometry", (t) => {
  const fc = featureCollection([
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [102.0, 0.5] },
      properties: { prop0: "value0" },
    },
    { type: "Feature", geometry: null, properties: { prop0: "value1" } },
  ]);

  // Clone
  const cloned = clone(fc);

  t.deepEqual(fc, cloned);
  t.end();
});
