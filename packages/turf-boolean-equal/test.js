const glob = require("glob");
const path = require("path");
const test = require("tape");
const load = require("load-json-file");
const shapely = require("boolean-shapely");
const { point, lineString, polygon } = require("@turf/helpers");
const equal = require("./index").default;

test("turf-boolean-equal", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = load.sync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const options = geojson.properties;
      const result = equal(feature1, feature2, options);

      if (process.env.SHAPELY)
        shapely
          .contains(feature1, feature2)
          .then((result) => t.true(result, "[true] shapely - " + name));
      t.true(result, "[true] " + name);
    });
  // False Fixtures
  glob
    .sync(path.join(__dirname, "test", "false", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = load.sync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const options = geojson.properties;
      const result = equal(feature1, feature2, options);

      if (process.env.SHAPELY)
        shapely
          .contains(feature1, feature2)
          .then((result) => t.false(result, "[false] shapely - " + name));
      t.false(result, "[false] " + name);
    });
  t.end();
});

const pt = point([9, 50]);
const line1 = lineString([
  [7, 50],
  [8, 50],
  [9, 50],
]);
const line2 = lineString([
  [7, 50],
  [8, 50],
  [9, 50],
]);
const poly1 = polygon(
  [
    [
      [8.5, 50],
      [9.5, 50],
      [9.5, 49],
      [8.5, 49],
      [8.5, 50],
    ],
  ],
  { prop: "A" }
);
const poly2 = polygon(
  [
    [
      [8.5, 50],
      [9.5, 50],
      [9.5, 49],
      [8.5, 49],
      [8.5, 50],
    ],
  ],
  { prop: "B" }
);
const poly3 = polygon([
  [
    [10, 50],
    [10.5, 50],
    [10.5, 49],
    [10, 49],
    [10, 50],
  ],
]);
const poly4 = polygon(
  [
    [
      [8.5, 50],
      [9.5, 50],
      [9.5, 49],
      [8.5, 49],
      [8.5, 50],
    ],
  ],
  { prop: "A" }
);

test("turf-boolean-equal -- geometries", (t) => {
  t.true(equal(line1.geometry, line2.geometry), "[true] LineString geometry");
  t.true(equal(poly1.geometry, poly2.geometry), "[true] Polygon geometry");
  t.true(equal(poly1, poly4), "[true] Polygon feature");
  t.false(equal(poly1.geometry, poly3.geometry), "[false] Polygon geometry");
  t.false(equal(pt, line1), "[false] different types");
  t.false(equal(poly1, poly2), "[false] different properties");
  t.end();
});

test("turf-boolean-equal -- throws", (t) => {
  //t.throws(() => equal(null, line1), /feature1 is required/, 'missing feature1');
  //t.throws(() => equal(line1, null), /feature2 is required/, 'missing feature2');
  t.throws(
    () => equal(line1.geometry, line2.geometry, { precision: "1" }),
    "precision must be a number"
  );
  t.throws(
    () => equal(line1.geometry, line2.geometry, { precision: -1 }),
    "precision must be positive"
  );
  t.end();
});
