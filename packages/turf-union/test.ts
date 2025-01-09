import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import {
  type FeatureCollection,
  type Polygon,
  type MultiPolygon,
} from "geojson";
import { union } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});

test("union", function (t) {
  for (const { name, geojson, filename } of fixtures) {
    // Only test the input fixture this way if there is a corresponding output
    // fixture to compare.
    if (fs.existsSync(path.join(directories.out, filename))) {
      const result = union(geojson);
      if (result === null) {
        t.fail("result was null");
      }

      if (process.env.REGEN)
        writeJsonFileSync(directories.out + filename, result);
      t.deepEqual(result, loadJsonFileSync(directories.out + filename), name);
    }
  }
  t.end();
});

test("union - unable to complete output ring ex 1 - issue 1983", function (t) {
  const polys = loadJsonFileSync(
    directories.in + "unable-to-complete-output-ring-1983-1.geojson"
  ) as FeatureCollection<Polygon>;

  // This used to fail with "Unable to complete output ring starting at ..."
  t.doesNotThrow(() => union(polys), "does not throw");

  t.end();
});

test("union - unable to complete output ring ex 2 - issue 1983", function (t) {
  const polys = loadJsonFileSync(
    directories.in + "unable-to-complete-output-ring-1983-2.geojson"
  ) as FeatureCollection<Polygon>;

  // This used to fail with "Unable to complete output ring starting at ..."
  t.doesNotThrow(() => union(polys), "does not throw");

  t.end();
});

test("union - maximum call stack size exceeded - issue 2317", function (t) {
  const polys = loadJsonFileSync(
    directories.in + "maximum-callstack-size-exceeded-2317.geojson"
  ) as FeatureCollection<MultiPolygon>;

  // This used to fail with "Maximum call stack size exceeded ..."
  t.doesNotThrow(() => union(polys), "does not throw");

  t.end();
});

test("union - unable to find segment ex 1 - issue 2258", function (t) {
  // Example from https://github.com/Turfjs/turf/issues/2258#issue-1125017544
  const polys = loadJsonFileSync(
    directories.in + "unable-to-find-segment-2258-1.geojson"
  ) as FeatureCollection<MultiPolygon>;

  // This used to fail with "Unable to find segment ..."
  t.doesNotThrow(() => union(polys), "does not throw");

  t.end();
});

test("union - unable to find segment ex 2 - issue 2258", function (t) {
  // Example from https://github.com/Turfjs/turf/issues/2258#issuecomment-1635573555
  const polys = loadJsonFileSync(
    directories.in + "unable-to-find-segment-2258-2.geojson"
  ) as FeatureCollection<MultiPolygon>;

  // This used to fail with "Unable to find segment ..."
  t.doesNotThrow(() => union(polys), "does not throw");

  t.end();
});
