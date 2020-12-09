const glob = require("glob");
const path = require("path");
const test = require("tape");
const load = require("load-json-file");
const { point } = require("@turf/helpers");
const booleanJSTS = require("boolean-jsts");
const shapely = require("boolean-shapely");
const contains = require("./index").default;

test("turf-boolean-contains", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = load.sync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = contains(feature1, feature2);

      if (process.env.JSTS)
        t.true(
          booleanJSTS("contains", feature1, feature2),
          "[true] JSTS - " + name
        );
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
      const result = contains(feature1, feature2);

      if (process.env.JSTS)
        t.false(
          booleanJSTS("contains", feature1, feature2),
          "[false] JSTS - " + name
        );
      if (process.env.SHAPELY)
        shapely
          .contains(feature1, feature2)
          .then((result) => t.false(result, "[false] shapely - " + name));
      t.false(result, "[false] " + name);
    });
  t.end();
});

test("turf-boolean-contains -- Geometry Objects", (t) => {
  const pt1 = point([0, 0]);
  const pt2 = point([0, 0]);

  t.assert(contains(pt1.geometry, pt2.geometry));
  t.end();
});
