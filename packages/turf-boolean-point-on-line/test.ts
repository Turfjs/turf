import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { point, lineString } from "@turf/helpers";
import booleanPointOnLine, {
  booleanPointOnLine as pointOnLine,
} from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

test("turf-boolean-point-on-line - issue 2750", (t) => {
  // Issue 2750 was that in the first test below where point is on a different
  // longitude to a zero length line booleanPointOnLine gave the correct result,
  // while the second test where a point on the SAME longitude, but nowhere
  // near, that zero length line incorrectly returned true.
  t.false(
    booleanPointOnLine(
      point([2, 13]),
      lineString([
        [1, 1],
        [1, 1],
      ])
    ),
    "#2750 different longitude point not on zero length line"
  );

  t.false(
    booleanPointOnLine(
      point([1, 13]),
      lineString([
        [1, 1],
        [1, 1],
      ])
    ),
    "#2750 same longitude point not on zero length line"
  );

  t.end();
});
