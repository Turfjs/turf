const test = require("tape");
const bboxPolygon = require("./index").default;

test("bbox-polygon", (t) => {
  const poly = bboxPolygon([0, 0, 10, 10]);

  t.ok(
    poly.geometry.coordinates,
    "should take a bbox and return the equivalent polygon feature"
  );
  t.equal(poly.geometry.type, "Polygon", "should be a Polygon geometry type");
  t.end();
});

test("bbox-polygon -- valid geojson", (t) => {
  const poly = bboxPolygon([0, 0, 10, 10]);
  const coordinates = poly.geometry.coordinates;

  t.ok(poly, "should be valid geojson.");
  t.equal(coordinates[0].length, 5);
  t.equal(coordinates[0][0][0], coordinates[0][coordinates.length - 1][0]);
  t.equal(coordinates[0][0][1], coordinates[0][coordinates.length - 1][1]);
  t.end();
});

// https://github.com/Turfjs/turf/issues/1119
test("bbox-polygon -- handling String input/output", (t) => {
  const poly = bboxPolygon(["0", "0", "10", "10"]);

  t.deepEqual(poly.geometry.coordinates[0][0], [0, 0], "lowLeft");
  t.deepEqual(poly.geometry.coordinates[0][1], [10, 0], "lowRight");
  t.deepEqual(poly.geometry.coordinates[0][2], [10, 10], "topRight");
  t.deepEqual(poly.geometry.coordinates[0][3], [0, 10], "topLeft");
  t.end();
});

test("bbox-polygon -- Error handling", (t) => {
  t.throws(
    () => bboxPolygon([-110, 70, 5000, 50, 60, 3000]),
    "6 position BBox not supported"
  );
  t.throws(() => bboxPolygon(["foo", "bar", "hello", "world"]), "invalid bbox");
  t.throws(() => bboxPolygon(["foo", "bar"]), "invalid bbox");
  t.end();
});

test("bbox-polygon -- Translate BBox (Issue #1179)", (t) => {
  const id = 123;
  const properties = { foo: "bar" };
  const bbox = [0, 0, 10, 10];
  const poly = bboxPolygon(bbox, { properties, id });

  t.deepEqual(poly.properties, properties, "Properties is translated");
  t.deepEqual(poly.bbox, bbox, "BBox is translated");
  t.equal(poly.id, id, "Id is translated");
  t.end();
});

test("bbox-polygon -- assert bbox", (t) => {
  const bbox = [0, 0, 10, 10];
  const poly = bboxPolygon(bbox);

  t.deepEqual(poly.bbox, bbox);
  t.end();
});
