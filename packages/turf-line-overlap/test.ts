import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { featureEach } from "@turf/meta";
import { featureCollection, lineString } from "@turf/helpers";
import { lineOverlap } from "./index.js";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("lineOverlap tolerance accounts for latitude", (t) => {
  for (const latitude of [80, -80, 89.999, -89.999]) {
    const polar = Math.abs(latitude) > 89;
    const step = polar ? 0.0001 : 0.01;
    const offset = polar ? 170 : 0.02;
    const first = lineString([
      [0, latitude],
      [0, latitude + step],
    ]);
    const second = lineString([
      [offset, latitude],
      [offset, latitude + step],
    ]);
    for (const [a, b] of [
      [first, second],
      [second, first],
    ]) {
      for (const coordinate of b.geometry.coordinates) {
        t.ok(
          nearestPointOnLine(a, coordinate).properties.pointDistance! < 1,
          "each endpoint is within the kilometer tolerance"
        );
      }
      t.equal(
        lineOverlap(a, b, { tolerance: 1 }).features.length,
        1,
        `find nearby segment at latitude ${latitude}`
      );
      t.equal(
        lineOverlap(a, b).features.length,
        0,
        "zero tolerance still excludes parallel offsets"
      );
    }
  }
  const first = lineString([
    [0, 0],
    [0, 0.01],
  ]);
  const second = lineString([
    [0.02, 0],
    [0.02, 0.01],
  ]);
  t.equal(
    lineOverlap(first, second, { tolerance: 1 }).features.length,
    0,
    "the equatorial gap exceeds one kilometer"
  );
  t.equal(
    lineOverlap(first, second, { tolerance: 2.5 }).features.length,
    1,
    "a larger tolerance includes the equatorial gap"
  );
  t.end();
});

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});
// fixtures = fixtures.filter(({name}) => name.includes('#901'));

test("turf-line-overlap", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const [source, target] = geojson.features;
    const shared = colorize(
      lineOverlap(source, target, geojson.properties),
      "#0F0"
    );
    const results = featureCollection(shared.features.concat([source, target]));

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("turf-line-overlap - Geometry Object", (t) => {
  const line1 = lineString([
    [115, -35],
    [125, -30],
    [135, -30],
    [145, -35],
  ]);
  const line2 = lineString([
    [135, -30],
    [145, -35],
  ]);

  t.true(
    lineOverlap(line1.geometry, line2.geometry).features.length > 0,
    "support geometry object"
  );
  t.end();
});

test("turf-line-overlap - multiple segments on same line", (t) => {
  const line1 = lineString([
    [0, 1],
    [1, 1],
    [1, 0],
    [2, 0],
    [2, 1],
    [3, 1],
    [3, 0],
    [4, 0],
    [4, 1],
    [4, 0],
  ]);
  const line2 = lineString([
    [0, 0],
    [6, 0],
  ]);

  t.true(
    lineOverlap(line1.geometry, line2.geometry).features.length === 2,
    "multiple segments on same line"
  );
  t.true(
    lineOverlap(line2.geometry, line1.geometry).features.length === 2,
    "multiple segments on same line - swapped order"
  );
  t.end();
});

function colorize(features, color = "#F00", width = 25) {
  const results = [];
  featureEach(features, (feature) => {
    feature.properties = {
      stroke: color,
      fill: color,
      "stroke-width": width,
    };
    results.push(feature);
  });
  if (features.type === "Feature") return results[0];
  return featureCollection(results);
}
