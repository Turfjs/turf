import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { featureCollection, polygon } from "@turf/helpers";
import { intersect } from "./index.js";
import { FeatureCollection, MultiPolygon, Polygon } from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename) as FeatureCollection<
      Polygon | MultiPolygon
    >,
  };
});

test("intersect", (t) => {
  for (const { name, geojson, filename } of fixtures) {
    if (name.includes("skip")) {
      t.skip(name);
      continue;
    }

    // Only test the input fixture this way if there is a corresponding output
    // fixture to compare.
    if (fs.existsSync(path.join(directories.out, filename))) {
      const [polygon1, polygon2] = geojson.features;

      // Red Polygon1
      polygon1.properties = Object.assign(polygon1.properties || {}, {
        "fill-opacity": 0.5,
        fill: "#F00",
      });
      // Blue Polygon2
      polygon2.properties = Object.assign(polygon2.properties || {}, {
        "fill-opacity": 0.5,
        fill: "#00F",
      });

      const fc = featureCollection([polygon1, polygon2]);
      const result = intersect(fc);
      if (result) {
        // Green Polygon
        result.properties = { "fill-opacity": 1, fill: "#0F0" };
        fc.features.push(result);
      }

      if (process.env.REGEN)
        writeJsonFileSync(directories.out + filename, result);
      t.deepEqual(fc, loadJsonFileSync(directories.out + filename), name);
    }
  }

  t.end();
});

test("intersect - unable to complete output ring - issue 2048", (t) => {
  // Test examples copied from https://github.com/Turfjs/turf/issues/2048
  let polys: FeatureCollection<Polygon>;

  polys = loadJsonFileSync(
    directories.in + "unable-to-complete-output-ring-2048-1.geojson"
  ) as FeatureCollection<Polygon>;

  // This used to fail with "Unable to complete output ring ..."
  t.doesNotThrow(() => intersect(polys), "does not throw ex 1");

  polys = loadJsonFileSync(
    directories.in + "unable-to-complete-output-ring-2048-2.geojson"
  ) as FeatureCollection<Polygon>;

  // This used to fail with "Unable to complete output ring ..."
  t.doesNotThrow(() => intersect(polys), "does not throw ex 2");

  t.end();
});

test("intersect - infinite loop - issue 2705", (t) => {
  // Test examples copied from https://github.com/Turfjs/turf/issues/2705
  let polys: FeatureCollection<Polygon>;

  polys = loadJsonFileSync(
    directories.in + "infinite-loop-2705.geojson"
  ) as FeatureCollection<Polygon>;

  // This used to get stuck in an infinite loop
  intersect(polys);

  t.ok(true, "should not get stuck in an infinite loop");

  t.end();
});

test.skip("intersect - infinite loop - issue 2601", (t) => {
  // Not actually going to commit the fixture file for this test as it's 76MB!
  // Tested locally though and it produces an identical result with no
  // workarounds: https://github.com/Turfjs/turf/issues/2601#issuecomment-2558307811

  // Test examples copied from https://github.com/Turfjs/turf/issues/2601
  let polys: FeatureCollection<Polygon>;

  polys = loadJsonFileSync(
    directories.in + "infinite-loop-2601.geojson"
  ) as FeatureCollection<Polygon>;

  // This used to get stuck in an infinite loop
  intersect(polys);

  t.ok(true, "should not get stuck in an infinite loop");

  t.end();
});

test.skip("intersect - missing islands - issue 2084", (t) => {
  // Unfortunately still broken, even with upgrade to polyclip-ts. Committing
  // now so we can enable when a fix is available.

  // Test example copied from https://github.com/Turfjs/turf/issues/2084
  let polys: FeatureCollection<Polygon>;

  polys = loadJsonFileSync(
    directories.in + "missing-islands-2084.geojson"
  ) as FeatureCollection<Polygon>;

  // "Islands" in the multipolygon aren't being included in the result.
  // TODO establish geojson file of expected output. For now clearly visually
  // not the same as https://github.com/Turfjs/turf/issues/2084#issuecomment-849975182
  const result = intersect(polys);
  t.ok(true, "islands included in intersection result");

  t.end();
});
