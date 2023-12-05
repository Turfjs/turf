import { glob } from "glob";
import path from "path";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import shapely from "boolean-shapely";
import booleanJSTS from "boolean-jsts";
import { booleanTouches as touches } from "./index";

test("turf-boolean-touches", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      if (name.includes("skip")) return t.skip(name);

      const geojson = loadJsonFileSync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = touches(feature1, feature2);
      if (process.env.JSTS)
        t.true(
          booleanJSTS("touches", feature1, feature2),
          "[true] JSTS - " + name
        );

      if (process.env.SHAPELY)
        shapely
          .touches(feature1, feature2)
          .then((result) => t.true(result, "[true] shapely - " + name));
      t.true(result, "[true] " + name);
    });
  // False Fixtures
  glob
    .sync(path.join(__dirname, "test", "false", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      if (name.includes("skip")) return t.skip(name);

      const geojson = loadJsonFileSync(filepath);
      const feature1 = geojson.features[0];
      const feature2 = geojson.features[1];
      const result = touches(feature1, feature2);
      if (process.env.JSTS)
        t.false(
          booleanJSTS("touches", feature1, feature2),
          "[false] JSTS - " + name
        );

      if (process.env.SHAPELY)
        shapely
          .touches(feature1, feature2)
          .then((result) => t.false(result, "[false] shapely - " + name));
      t.false(result, "[false] " + name);
    });
  t.end();
});
