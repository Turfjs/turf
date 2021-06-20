const glob = require("glob");
const path = require("path");
const test = require("tape");
const load = require("load-json-file");
const shapely = require("boolean-shapely");
const intersects = require("./index").default;

test("turf-boolean-intersects", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = load.sync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = intersects(feature1, feature2);

      if (process.env.SHAPELY)
        shapely
          .intersects(feature1, feature2)
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
      const result = intersects(feature1, feature2);

      if (process.env.SHAPELY)
        shapely
          .intersects(feature1, feature2)
          .then((result) => t.false(result, "[false] shapely - " + name));
      t.false(result, "[false] " + name);
    });
  t.end();
});
