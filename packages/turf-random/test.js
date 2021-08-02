const test = require("tape");
const {
  randomPoint,
  randomPolygon,
  randomLineString,
  randomPosition,
} = require("./index");

test("random(points)", (t) => {
  var points = randomPoint();
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 1, "right number of features");
  t.equal(points.features[0].geometry.type, "Point", "feature type correct");
  t.end();
});

test("random(polygons)", (t) => {
  var points = randomPolygon();
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 1, "right number of features");
  t.equal(points.features[0].geometry.type, "Polygon", "feature type correct");
  t.end();
});

test("random(polygons, 10)", (t) => {
  var points = randomPolygon(10);
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 10, "right number of features");
  t.equal(points.features[0].geometry.type, "Polygon", "feature type correct");
  t.end();
});

test("random(polygons, 1, {num_vertices})", (t) => {
  var points = randomPolygon(10, { num_vertices: 23 });
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 10, "right number of features");
  t.equal(
    points.features[0].geometry.coordinates[0].length,
    24,
    "num vertices"
  );
  t.end();
});

test("random(points, 10, {bbox})", (t) => {
  var points = randomPoint(10, { bbox: [0, 0, 0, 0] });
  t.equal(points.type, "FeatureCollection", "is a featurecollection");
  t.equal(points.features.length, 10, "right number of features");
  t.equal(points.features[0].geometry.type, "Point", "feature type correct");
  t.deepEqual(
    points.features[0].geometry.coordinates,
    [0, 0],
    "feature type correct"
  );
  t.end();
});

test("bbox input gets validated", (t) => {
  const bbox = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]; // this is invalid

  t.throws(() => {
    randomPoint(1, { bbox });
  }, "randomPoint checks bbox validity");
  t.throws(() => {
    randomPolygon(1, { bbox });
  }, "randomPolygon checks bbox validity");
  t.throws(() => {
    randomLineString(1, { bbox });
  }, "randomLineString checks bbox validity");
  t.throws(() => {
    randomPosition(bbox);
  }, "randomPosition checks bbox validity");
  t.end();
});
