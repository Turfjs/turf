import { glob } from "glob";
import path from "path";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { booleanPointOnLine as pointOnLine } from "./index";

test("turf-boolean-point-on-line", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
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
      const geojson = loadJsonFileSync(filepath);
      const options = geojson.properties;
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = pointOnLine(feature1, feature2, options);

      t.false(result, "[false] " + name);
    });
  t.end();
});
