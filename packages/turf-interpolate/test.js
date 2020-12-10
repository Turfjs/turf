import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import truncate from "@turf/truncate";
import { brightness } from "chromatism";
import { round, featureCollection, point } from "@turf/helpers";
import { featureEach, propEach } from "@turf/meta";
import interpolate from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

var fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename),
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

    if (process.env.REGEN) write.sync(directories.out + filename, result);
    t.deepEquals(result, load.sync(directories.out + filename), name);
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
    const color = brightness(-percent, "#0086FF").hex;
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
