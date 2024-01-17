import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { lineString } from "@turf/helpers";
import { booleanParallel } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("turf-boolean-parallel", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
      const line1 = geojson.features[0];
      const line2 = geojson.features[1];
      const result = booleanParallel(line1, line2);

      t.true(result, "[true] " + name);
    });
  // False Fixtures
  glob
    .sync(path.join(__dirname, "test", "false", "**", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
      const line1 = geojson.features[0];
      const line2 = geojson.features[1];
      const result = booleanParallel(line1, line2);

      t.false(result, "[false] " + name);
    });
  t.end();
});

test("turf-boolean-parallel -- throws", (t) => {
  const line = lineString([
    [0, 0],
    [0, 1],
  ]);

  t.throws(
    () => booleanParallel({}, line),
    /Invalid GeoJSON object for line1/,
    "invalid types"
  );
  t.throws(
    () => booleanParallel(line, {}),
    /Invalid GeoJSON object for line2/,
    "invalid types"
  );

  t.end();
});
