import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import chromatism from "chromatism";
import { round, featureCollection, point } from "@turf/helpers";
import { featureEach, propEach } from "@turf/meta";
import { interpolate } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

var fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});
// fixtures = fixtures.filter(fixture => fixture.name === 'points-random')

test("turf-interpolate", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const options = geojson.properties;
    const cellSize = options.cellSize;
    const property = options.property || "elevation";

    // Truncate coordinates & elevation (property) to 6 precision
    let result = truncate(interpolate(geojson, cellSize, options));
    propEach(result, (properties) => {
      properties[property] = round(properties[property]);
    });
    result = colorize(result, property, name);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, result);
    t.deepEquals(result, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("turf-interpolate -- throws errors", (t) => {
  const cellSize = 1;
  const weight = 0.5;
  const units = "miles";
  const gridType = "point";
  const points = featureCollection([
    point([1, 2], { elevation: 200 }),
    point([2, 1], { elevation: 300 }),
    point([1.5, 1.5], { elevation: 400 }),
  ]);

  t.assert(
    interpolate(points, cellSize, {
      gridType: gridType,
      units: units,
      weight: weight,
    }).features.length
  );
  t.throws(
    () => interpolate(points, undefined),
    /cellSize is required/,
    "cellSize is required"
  );
  t.throws(
    () => interpolate(undefined, cellSize),
    /points is required/,
    "points is required"
  );
  t.throws(
    () => interpolate(points, cellSize, { gridType: "foo" }),
    /invalid gridType/,
    "invalid gridType"
  );
  t.throws(
    () => interpolate(points, cellSize, { units: "foo" }),
    "invalid units"
  );
  t.throws(
    () => interpolate(points, cellSize, { weight: "foo" }),
    /weight must be a number/,
    "weight must be a number"
  );
  t.throws(
    () => interpolate(points, cellSize, { property: "foo" }),
    /zValue is missing/,
    "zValue is missing"
  );
  t.throws(
    () =>
      interpolate(featureCollection([point([0, 0])]), 1000, {
        gridType: "point",
        bbox: [-1, -1, 1, 1],
      }),
    /zValue is missing/,
    "an exact match still requires a zValue"
  );
  t.end();
});

test("turf-interpolate -- zValue from 3rd coordinate", (t) => {
  const cellSize = 1;
  const points = featureCollection([
    point([1, 2, 200]),
    point([2, 1, 300]),
    point([1.5, 1.5, 400]),
  ]);
  t.assert(
    interpolate(points, cellSize).features.length,
    "zValue from 3rd coordinate"
  );
  t.end();
});

test("turf-interpolate -- exact match preserves the input value", (t) => {
  for (const elevation of [42, 0, -10]) {
    for (const matchIndex of [0, 1, 2]) {
      const samples = [
        point([1, 1], { elevation: 100 }),
        point([-1, 1], { elevation: 200 }),
      ];
      samples.splice(matchIndex, 0, point([0, 0, 999], { elevation }));
      const points = featureCollection(samples);
      const original = JSON.stringify(points);
      const result = interpolate(points, 1000, {
        gridType: "point",
        bbox: [-1, -1, 1, 1],
      });

      t.equal(result.features.length, 1, "one grid point");
      t.deepEqual(result.features[0].geometry.coordinates, [0, 0]);
      t.equal(
        result.features[0].properties.elevation,
        elevation,
        `exact value ${elevation} at input index ${matchIndex}`
      );
      t.equal(JSON.stringify(points), original, "input is not modified");
    }
  }
  t.end();
});

test("turf-interpolate -- exact match with different weights", (t) => {
  const points = featureCollection([
    point([1, 1], { elevation: 100 }),
    point([0, 0], { elevation: 42 }),
  ]);
  for (const weight of [0.5, 2, 0, -1]) {
    for (const features of [points.features, [...points.features].reverse()]) {
      const result = interpolate(featureCollection(features), 1000, {
        gridType: "point",
        bbox: [-1, -1, 1, 1],
        weight,
      });
      t.equal(result.features[0].properties.elevation, 42, `weight ${weight}`);
    }
  }
  t.end();
});

test("turf-interpolate -- exact match uses the third coordinate fallback", (t) => {
  const result = interpolate(featureCollection([point([0, 0, -10])]), 1000, {
    gridType: "point",
    bbox: [-1, -1, 1, 1],
    property: "temperature",
  });
  t.equal(result.features[0].properties.temperature, -10);
  t.end();
});

test("turf-interpolate -- exact match at a polygon centroid", (t) => {
  const result = interpolate(
    featureCollection([
      point([1, 1], { elevation: 100 }),
      point([0, 0], { elevation: 42 }),
    ]),
    200,
    { bbox: [-1, -1, 1, 1] }
  );
  t.equal(result.features.length, 1, "one square grid cell");
  t.equal(result.features[0].properties.elevation, 42);
  t.end();
});

test("turf-interpolate -- nonmatching points retain distance weighting", (t) => {
  const points = featureCollection([
    point([-1, 0], { elevation: 20 }),
    point([1, 0], { elevation: 40 }),
  ]);
  for (const weight of [0, 1, 2, -1]) {
    const result = interpolate(points, 1000, {
      gridType: "point",
      bbox: [-1, -1, 1, 1],
      weight,
    });
    t.equal(
      round(result.features[0].properties.elevation),
      30,
      `weight ${weight}`
    );
  }
  t.end();
});

// style result
function colorize(grid, property, name) {
  property = property || "elevation";
  let max = -Infinity;
  let min = Infinity;
  propEach(grid, (properties) => {
    const value = properties[property];
    if (value > max) max = value;
    if (value < min) min = value;
  });
  const delta = max - min;
  if (delta === 0) throw new Error(name + " delta is invalid");

  featureEach(grid, (feature) => {
    const value = feature.properties[property];
    const percent = round(((value - min - delta / 2) / delta) * 100);
    // darker corresponds to higher values
    const color = chromatism.brightness(-percent, "#0086FF").hex;
    if (feature.geometry.type === "Point")
      feature.properties["marker-color"] = color;
    else {
      feature.properties["stroke"] = color;
      feature.properties["fill"] = color;
      feature.properties["fill-opacity"] = 0.85;
    }
  });

  return grid;
}
