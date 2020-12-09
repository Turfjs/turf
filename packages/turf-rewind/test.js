import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import {
  polygon,
  lineString,
  featureCollection,
  geometryCollection,
} from "@turf/helpers";
import rewind from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename),
  };
});
// fixtures = fixtures.filter(fixture => fixture.name === 'polygon-clockwise');

test("turf-rewind", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const { reverse } = geojson.properties || {};
    const results = rewind(geojson, reverse);

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEqual(results, load.sync(directories.out + filename), name);
  }
  t.end();
});

test("turf-buffer - Support Geometry Objects", (t) => {
  const line = lineString([
    [11, 0],
    [22, 4],
    [31, 0],
    [31, 11],
  ]);
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
  const gc = geometryCollection([poly.geometry, line.geometry]);
  const fc = featureCollection([poly, line]);

  t.assert(rewind(line.geometry), "support LineString Geometry");
  t.assert(rewind(poly.geometry), "support Polygon Geometry");
  t.assert(rewind(fc), "support Feature Collection");
  t.assert(rewind(gc), "support Geometry Collection");
  t.end();
});

test("turf-buffer - Prevent Input Mutation", (t) => {
  const line = lineString([
    [11, 0],
    [22, 4],
    [31, 0],
    [31, 11],
  ]);
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
  const beforeLine = JSON.parse(JSON.stringify(line));
  rewind(poly);
  rewind(line);

  t.deepEqual(poly, beforePoly, "poly should not mutate");
  t.deepEqual(line, beforeLine, "line should not mutate");
  t.end();
});
