import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { circle } from "@turf/circle";
import { truncate } from "@turf/truncate";
import {
  geometryCollection,
  featureCollection,
  point,
  lineString,
  round,
} from "@turf/helpers";
import { nearestPointToLine } from "./index";

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

test("turf-nearest-point-to-line", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const points = geojson.features[0];
    const line = geojson.features[1];
    const units = (geojson.properties || {}).units;

    const nearest = nearestPointToLine(points, line, { units: units });
    const distance = round(nearest.properties.dist, 6);
    nearest.properties.dist = distance;
    nearest.properties = Object.assign(nearest.properties, {
      "marker-color": "#F00",
      "marker-size": "large",
      "marker-symbol": "star",
    });
    const distanceCircle = truncate(
      circle(nearest, distance || 1, {
        units: units,
        properties: { fill: "#F00" },
      })
    );
    const results = featureCollection([points, nearest, line, distanceCircle]);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEqual(results, loadJsonFileSync(directories.out + filename), name);
  });
  t.end();
});

test("turf-nearest-point-to-line -- throws", (t) => {
  const points = featureCollection([point([0, 0]), point([0, 1])]);
  const line = lineString([
    [1, 1],
    [-1, 1],
  ]);

  // Handled by Typescript
  // t.throws(() => nearestPointToLine(null, line), /points is required/, 'missing points');
  // t.throws(() => nearestPointToLine(points, null), /line is required/, 'missing line');
  // t.throws(() => nearestPointToLine(points, line, 'invalid'), /options is invalid/, 'options is invalid');

  t.throws(
    () => nearestPointToLine(points, line, { units: "invalid" }),
    /units is invalid/,
    "invalid units"
  );
  t.throws(
    () => nearestPointToLine(points, points),
    /line must be a LineString/,
    "invalid line"
  );
  t.throws(
    () => nearestPointToLine(line, line),
    /points must be a Point Collection/,
    "invalid points"
  );

  t.end();
});

test("turf-nearest-point-to-line -- Geometry", (t) => {
  const points = featureCollection([point([0, 0]), point([0, 1])]);
  const geomPoints = geometryCollection([
    point([0, 0]).geometry,
    point([0, 1]).geometry,
  ]);
  const line = lineString([
    [1, 1],
    [-1, 1],
  ]);

  t.assert(nearestPointToLine(points, line.geometry));
  t.assert(nearestPointToLine(geomPoints, line.geometry));
  t.end();
});

test("turf-nearest-point-to-line -- Empty FeatureCollection", (t) => {
  const points = featureCollection([]);
  const line = lineString([
    [1, 1],
    [-1, 1],
  ]);

  t.throws(
    () => nearestPointToLine(points, line),
    /points must contain features/,
    "points must contain features"
  );
  t.end();
});
