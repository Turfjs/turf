import { test } from "tape";
import { globSync } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { polygon, multiPolygon, featureCollection } from "@turf/helpers";
import intersectByAreaPercentage from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("@turf/intersect-by-area-percentage", (t) => {
  // Load test fixtures
  const fixtures = globSync(path.join(__dirname, "test", "in", "*.json")).map(
    (filepath) => {
      const name = path.parse(filepath).name;
      const geojson = loadJsonFileSync(filepath);
      return {
        name,
        geojson,
        filepath,
      };
    }
  );

  for (const { name, geojson } of fixtures) {
    const { features } = geojson;
    const [poly1, poly2, poly3, polyNoOverlap, multiPoly1] = features;

    // Test cases based on fixture data
    t.true(
      intersectByAreaPercentage(poly1, poly3, 0.2),
      `${name}: poly1 vs poly3 (threshold 0.2) - Should intersect >= 20%`
    );
    t.false(
      intersectByAreaPercentage(poly1, poly2, 0.3),
      `${name}: poly1 vs poly2 (threshold 0.3) - Should intersect < 30%`
    );
    t.true(
        intersectByAreaPercentage(poly1, poly2, 0.25),
        `${name}: poly1 vs poly2 (threshold 0.25) - Should intersect >= 25% (exact)`
    );
    t.false(
      intersectByAreaPercentage(poly1, polyNoOverlap, 0.01),
      `${name}: poly1 vs polyNoOverlap (threshold 0.01) - Should not intersect`
    );
    t.true(
      intersectByAreaPercentage(poly1, polyNoOverlap, 0.0),
      `${name}: poly1 vs polyNoOverlap (threshold 0.0) - Should be true for zero threshold`
    );
    t.true(
      intersectByAreaPercentage(poly1, poly1, 1.0),
      `${name}: poly1 vs poly1 (threshold 1.0) - Should be 100% overlap`
    );
    t.false(
      intersectByAreaPercentage(poly1, poly1, 1.1),
      `${name}: poly1 vs poly1 (invalid threshold > 1.0) - Should be false`
    );
    t.false(
        intersectByAreaPercentage(poly1, poly1, -0.1),
        `${name}: poly1 vs poly1 (invalid threshold < 0.0) - Should be false`
      );
    t.true(
        intersectByAreaPercentage(poly1, multiPoly1, 0.49),
        `${name}: poly1 vs multiPoly1 (threshold 0.49) - Should intersect >= 49%`
      );
      t.false(
        intersectByAreaPercentage(poly1, multiPoly1, 0.51),
        `${name}: poly1 vs multiPoly1 (threshold 0.51) - Should intersect < 51%`
      );
  }

  // Additional edge cases
  const zeroAreaPoly = polygon([[[0, 0], [0, 0], [0, 0], [0, 0]]]);
  const targetPoly = polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);

  t.true(intersectByAreaPercentage(targetPoly, zeroAreaPoly, 0.0), "Zero area test polygon with threshold 0.0");
  t.false(intersectByAreaPercentage(targetPoly, zeroAreaPoly, 0.1), "Zero area test polygon with threshold > 0.0");
  t.false(intersectByAreaPercentage(null, targetPoly, 0.5), "Null target polygon");
  t.false(intersectByAreaPercentage(targetPoly, null, 0.5), "Null test polygon");
  // @ts-expect-error testing invalid input
  t.false(intersectByAreaPercentage(targetPoly, targetPoly, 'invalid'), "Invalid threshold type");

  t.end();
}); 