const glob = require("glob");
const path = require("path");
const test = require("tape");
const load = require("load-json-file");
const pointOnLine = require("./index").default;

test("turf-boolean-point-on-line", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = load.sync(filepath);
      const options = geojson.properties;
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = pointOnLine(feature1, feature2, options);

      t.true(result, "[true] " + name);
    });
  // False Fixtures
  glob
    .sync(path.join(__dirname, "test", "false", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = load.sync(filepath);
      const options = geojson.properties;
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = pointOnLine(feature1, feature2, options);

      t.false(result, "[false] " + name);
    });
  t.end();
});
