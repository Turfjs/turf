import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { lineString, point } from "@turf/helpers";
import booleanJSTS from "boolean-jsts";
import shapely from "boolean-shapely";
import { booleanContains as contains } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

test("turf-boolean-contains -- LineString segment coverage", (t) => {
  t.false(
    contains(
      lineString([
        [0, 0],
        [2, 2],
        [4, 0],
      ]),
      lineString([
        [1, 1],
        [3, 1],
      ])
    ),
    "a chord can leave the line even when both endpoints lie on it"
  );
  t.false(
    contains(
      lineString([
        [-1, 0],
        [1, 0],
        [2, 1],
        [3, 0],
        [5, 0],
      ]),
      lineString([
        [0, 0],
        [4, 0],
      ])
    ),
    "collinear segments separated by a gap do not cover the inner segment"
  );
  t.true(
    contains(
      lineString([
        [4, 4],
        [2, 2],
        [0, 0],
      ]),
      lineString([
        [1, 1],
        [3, 3],
      ])
    ),
    "adjacent collinear segments cover the whole inner segment in reverse order"
  );
  t.true(
    contains(
      lineString([
        [0, 0],
        [0, 2],
        [0, 2],
        [0, 4],
      ]),
      lineString([
        [0, 4],
        [0, 0],
      ])
    ),
    "vertical coverage ignores zero-length segments"
  );
  const a = 19 * 2 ** -54;
  t.true(
    contains(
      lineString([
        [0, 0],
        [1, 3],
      ]),
      lineString([
        [a, 3 * a],
        [1, 3],
      ])
    ),
    "collinearity survives rounding near an endpoint"
  );
  t.true(
    contains(
      lineString([
        [0.1, 0.2],
        [0.6, 0.7],
      ]),
      lineString([
        [0.4, 0.5],
        [0.5, 0.6],
      ])
    ),
    "preserves containment on one segment for fractional coordinates"
  );
  t.end();
});
