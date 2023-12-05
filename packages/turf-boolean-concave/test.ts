import { glob } from "glob";
import path from "path";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { polygon } from "@turf/helpers";
import { booleanConcave as isConcave } from "./index.js";

test("isConcave#fixtures", (t) => {
  // True Fixtures
  glob
    .sync(path.join(__dirname, "test", "true", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
      const feature = geojson.features[0];
      t.true(isConcave(feature), "[true] " + name);
    });
  // False Fixtures
  glob
    .sync(path.join(__dirname, "test", "false", "*.geojson"))
    .forEach((filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
      const feature = geojson.features[0];
      t.false(isConcave(feature), "[false] " + name);
    });
  t.end();
});

test("isConcave -- Geometry types", (t) => {
  const poly = polygon([
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  ]);

  t.equal(isConcave(poly), false, "Feature");
  t.equal(isConcave(poly.geometry), false, "Geometry Object");

  t.end();
});
