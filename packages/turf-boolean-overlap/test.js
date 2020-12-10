const glob = require("glob");
const path = require("path");
const test = require("tape");
const load = require("load-json-file");
const shapely = require("boolean-shapely");
const {
  point,
  lineString,
  polygon,
  multiLineString,
  multiPolygon,
} = require("@turf/helpers");
const overlap = require("./index").default;

test("turf-boolean-overlap", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = load.sync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = overlap(feature1, feature2);

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
      const result = overlap(feature1, feature2);

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
  [8, 50],
  [9, 50],
  [10, 50],
]);
const poly1 = polygon([
  [
    [8.5, 50],
    [9.5, 50],
    [9.5, 49],
    [8.5, 49],
    [8.5, 50],
  ],
]);
const poly2 = polygon([
  [
    [8, 50],
    [9, 50],
    [9, 49],
    [8, 49],
    [8, 50],
  ],
]);
const poly3 = polygon([
  [
    [10, 50],
    [10.5, 50],
    [10.5, 49],
    [10, 49],
    [10, 50],
  ],
]);
const multiline1 = multiLineString([
  [
    [7, 50],
    [8, 50],
    [9, 50],
  ],
]);
const multipoly1 = multiPolygon([
  [
    [
      [8.5, 50],
      [9.5, 50],
      [9.5, 49],
      [8.5, 49],
      [8.5, 50],
    ],
  ],
]);

test("turf-boolean-overlap -- geometries", (t) => {
  t.true(overlap(line1.geometry, line2.geometry), "[true] LineString geometry");
  t.true(overlap(poly1.geometry, poly2.geometry), "[true] Polygon geometry");
  t.false(overlap(poly1.geometry, poly3.geometry), "[false] Polygon geometry");
  t.end();
});

test("turf-boolean-overlap -- throws", (t) => {
  // t.throws(() => overlap(null, line1), /feature1 is required/, 'missing feature1');
  // t.throws(() => overlap(line1, null), /feature2 is required/, 'missing feature2');
  t.throws(
    () => overlap(poly1, line1),
    /features must be of the same type/,
    "different types"
  );
  t.throws(
    () => overlap(pt, pt),
    /Point geometry not supported/,
    "geometry not supported"
  );

  t.doesNotThrow(
    () => overlap(line1, multiline1),
    "supports line and multiline comparison"
  );
  t.doesNotThrow(
    () => overlap(poly1, multipoly1),
    "supports polygon and multipolygon comparison"
  );

  t.end();
});
