import { glob } from "glob";
import path from "path";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { booleanValid as isValid } from "./index";

test("turf-boolean-valid", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;

      if (name === "multipolygon-touch") return t.skip("multipolygon-touch");

      const geojson = loadJsonFileSync(filepath);
      const feature1 = geojson.features[0];
      const result = isValid(feature1);

      // if (process.env.SHAPELY) shapely.contains(feature1).then(result => t.true(result, '[true] shapely - ' + name));
      t.true(result, "[true] " + name);
    });
  // False Fixtures
  glob
    .sync(path.join(__dirname, "test", "false", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
      const feature1 = geojson.features[0];
      const result = isValid(feature1);

      // if (process.env.SHAPELY) shapely.contains(feature1, feature2).then(result => t.false(result, '[false] shapely - ' + name));
      t.false(result, "[false] " + name);
    });
  t.end();
});

test("turf-boolean-valid -- obvious fails", (t) => {
  t.false(isValid({ foo: "bar" }));
  t.end();
});
