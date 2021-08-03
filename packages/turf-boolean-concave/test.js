const glob = require("glob");
const path = require("path");
const test = require("tape");
const load = require("load-json-file");
const { polygon } = require("@turf/helpers");
const isConcave = require("./dist/js/index.js").default;

test("isConcave#fixtures", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = load.sync(filepath);
      const feature = geojson.features[0];
      t.true(isConcave(feature), "[true] " + name);
    });
  // False Fixtures
  glob
    .sync(path.join(__dirname, "test", "false", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = load.sync(filepath);
      const feature = geojson.features[0];
      t.false(isConcave(feature), "[false] " + name);
    });
  t.end();
});

test("isConcave -- Geometry types", (t) => {
  const poly = polygon([
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  ]);

  t.equal(isConcave(poly), false, "Feature");
  t.equal(isConcave(poly.geometry), false, "Geometry Object");

  t.end();
});
