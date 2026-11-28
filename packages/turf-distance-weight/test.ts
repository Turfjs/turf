import { featureCollection, point } from "@turf/helpers";

import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { distanceWeight, pNormDistance } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("pNormDistance function", (t) => {
  t.equal(pNormDistance(point([2, 0]), point([0, 0]), 2), 2, "2-norm is ok");
  t.equal(pNormDistance(point([1, 1]), point([0, 0]), 1), 2, "1-norm is ok");
  t.end();
});

test("pNormDistance uses coordinate magnitudes for every norm", (t) => {
  for (const [p, coordinates, expected] of [
    [3, [1, 2], Math.cbrt(9)],
    [1.5, [1, 4], Math.pow(9, 2 / 3)],
    [Infinity, [1, 2], 2],
    [Infinity, [0, 0], 0],
  ] as const) {
    for (const xSign of [-1, 1]) {
      for (const ySign of [-1, 1]) {
        const a = point([coordinates[0] * xSign, coordinates[1] * ySign]);
        const b = point([0, 0]);
        t.ok(
          Math.abs(pNormDistance(a, b, p) - expected) < 1e-12,
          `${p}-norm in quadrant ${xSign},${ySign}`
        );
        t.equal(pNormDistance(a, b, p), pNormDistance(b, a, p), "symmetric");
      }
    }
  }
  t.end();
});

test("distanceWeight applies non-Euclidean distance thresholds", (t) => {
  const points = featureCollection([point([0, 0]), point([1, 2])]);
  t.deepEqual(
    distanceWeight(points, { p: 3, threshold: 3, alpha: 1 }),
    [
      [0, Math.cbrt(9)],
      [Math.cbrt(9), 0],
    ],
    "third-order weights use the distance rather than zero"
  );
  t.deepEqual(
    distanceWeight(points, { p: Infinity, threshold: 1.5, binary: true }),
    [
      [0, 0],
      [0, 0],
    ],
    "infinity norm excludes points outside the threshold"
  );
  t.end();
});

test("turf-distance-weight", (t) => {
  const columbusPath = path.join(__dirname, "test", "in", "point.json");
  const columbusJson = loadJsonFileSync(columbusPath);

  let result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: false,
    p: 1,
    alpha: 1,
    standardization: false,
  });
  t.equal(result[0][1], 0.8320121090670778, "base arguments");

  // test threshold
  result = distanceWeight(columbusJson, {
    threshold: 2,
    binary: false,
    p: 1,
    alpha: 1,
  });
  t.equal(result[0][1], 0.8320121090670778, "change threshold");

  // test binary
  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: true,
    p: 1,
    alpha: 1,
  });
  t.equal(result[0][1], 1, "change binary");

  // test p
  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: false,
    p: 2,
    alpha: 1,
  });
  t.equal(result[0][1], 0.5987182558007202, "change p");

  // test alpha
  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: false,
    p: 1,
    alpha: -1,
  });
  t.equal(result[0][1], 1.201905584188293, "change alpha");

  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: false,
    p: 1,
    alpha: 1,
    standardization: true,
  });
  t.equal(result[0][1], 0.5311565480348293, "standardization 1");

  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: true,
    p: 1,
    alpha: 1,
    standardization: true,
  });
  t.equal(result[0][1], 0.5, "standardization 2");

  // test default
  result = distanceWeight(columbusJson);
  t.equal(result[0][1], 1.6702346893742355, "default arguments");

  t.end();
});
