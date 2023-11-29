import { glob } from "glob";
import path from "path";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { point } from "@turf/helpers";
import booleanJSTS from "boolean-jsts";
import shapely from "boolean-shapely";
import { booleanContains as contains } from "./index";

test("turf-boolean-contains", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
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
      const geojson = loadJsonFileSync(filepath);
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
