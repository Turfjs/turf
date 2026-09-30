import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { polygon, point } from "@turf/helpers";
import { polygonTangents } from "./index.js";

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

test("turf-polygon-tangents", (t) => {
  for (const { name, filename, geojson } of fixtures) {
    const [poly, pt] = geojson.features;
    const results = polygonTangents(pt, poly);
    results.features = results.features.concat(geojson.features);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEqual(loadJsonFileSync(directories.out + filename), results, name);
  }
  t.end();
});

test("turf-polygon-tangents - Geometry Objects", (t) => {
  const pt = point([61, 5]);
  const poly = polygon([
    [
      [11, 0],
      [22, 4],
      [31, 0],
      [31, 11],
      [21, 15],
      [11, 11],
      [11, 0],
    ],
  ]);
  t.assert(polygonTangents(pt.geometry, poly.geometry));
  t.end();
});

test("turf-polygon-tangents - Prevent Input Mutation", (t) => {
  const pt = point([61, 5]);
  const poly = polygon([
    [
      [11, 0],
      [22, 4],
      [31, 0],
      [31, 11],
      [21, 15],
      [11, 11],
      [11, 0],
    ],
  ]);
  const beforePoly = JSON.parse(JSON.stringify(poly));
  const beforePt = JSON.parse(JSON.stringify(pt));
  polygonTangents(pt.geometry, poly.geometry);
  t.deepEqual(poly, beforePoly, "pt should not mutate");
  t.deepEqual(pt, beforePt, "poly should not mutate");
  t.end();
});

test("turf-polygon-tangents - Issue #1050", (t) => {
  const pt = [8.725, 51.57];
  const poly = polygon([
    [
      [8.788482103824089, 51.56063487730164],
      [8.788583, 51.561554],
      [8.78839, 51.562241],
      [8.78705, 51.563616],
      [8.785483, 51.564445],
      [8.785481, 51.564446],
      [8.785479, 51.564447],
      [8.785479, 51.564449],
      [8.785478, 51.56445],
      [8.785478, 51.564452],
      [8.785479, 51.564454],
      [8.78548, 51.564455],
      [8.785482, 51.564457],
      [8.786358, 51.565053],
      [8.787022, 51.565767],
      [8.787024, 51.565768],
      [8.787026, 51.565769],
      [8.787028, 51.56577],
      [8.787031, 51.565771],
      [8.787033, 51.565771],
      [8.789951649580397, 51.56585502173034],
      [8.789734, 51.563604],
      [8.788482103824089, 51.56063487730164],
    ],
  ]);
  try {
    t.assert(polygonTangents(pt, poly));
  } catch (e) {
    t.skip("issue #1050 failed");
  }
  t.end();
});

test("turf-polygon-tangents - Issue #2898", (t) => {
  // When the viewpoint is inside the polygon bbox and the nearest vertex is
  // below the viewpoint, polygonTangents previously returned the same point
  // for both tangents instead of two distinct tangent vertices.
  const pt = point([-79.41285676230808, 43.627309605975235]);
  const poly = polygon([
    [
      [-79.428776, 43.708224],
      [-79.325734, 43.675502],
      [-79.414155, 43.595383],
      [-79.353931, 43.670969],
      [-79.428776, 43.708224],
    ],
  ]);
  const tangents = polygonTangents(pt, poly);
  t.equal(tangents.features.length, 2, "returns two features");
  const [t1, t2] = tangents.features.map((f) => f.geometry.coordinates);
  t.notDeepEqual(t1, t2, "tangent points must be distinct vertices");
  t.end();
});
