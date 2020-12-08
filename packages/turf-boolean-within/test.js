const glob = require("glob");
const path = require("path");
const test = require("tape");
const load = require("load-json-file");
const shapely = require("boolean-shapely");
const booleanJSTS = require("boolean-jsts");
const within = require("./index").default;

test("turf-boolean-within", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      if (name.includes("skip")) return t.skip(name);

      const geojson = load.sync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = within(feature1, feature2);
      if (process.env.JSTS)
        t.true(
          booleanJSTS("within", feature1, feature2),
          "[true] JSTS - " + name
        );

      if (process.env.SHAPELY)
        shapely
          .within(feature1, feature2)
          .then((result) => t.true(result, "[true] shapely - " + name));
      t.true(result, "[true] " + name);
    });
  // False Fixtures
  glob
    .sync(path.join(__dirname, "test", "false", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      if (name.includes("skip")) return t.skip(name);

      const geojson = load.sync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = within(feature1, feature2);
      if (process.env.JSTS)
        t.false(
          booleanJSTS("within", feature1, feature2),
          "[false] JSTS - " + name
        );

      if (process.env.SHAPELY)
        shapely
          .within(feature1, feature2)
          .then((result) => t.false(result, "[false] shapely - " + name));
      t.false(result, "[false] " + name);
    });
  t.end();
});
