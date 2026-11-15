import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { featureCollection, lineString, polygon } from "@turf/helpers";
import { lineIntersect } from "./index.js";
import { Feature, LineString, Point } from "geojson";

const directories = {
  in: path.join("test", "in") + path.sep,
  out: path.join("test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(
      directories.in + filename
    ) as GeoJSON.FeatureCollection<LineString>,
  };
});

test("turf-line-intersect", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const [line1, line2] = geojson.features;
    const results: GeoJSON.FeatureCollection<LineString | Point> = truncate(
      lineIntersect(line1, line2)
    );
    results.features.push(line1);
    results.features.push(line2);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("turf-line-intersect - prevent input mutation", (t) => {
  const line1 = lineString([
    [7, 50],
    [8, 50],
    [9, 50],
  ]);
  const line2 = lineString([
    [8, 49],
    [8, 50],
    [8, 51],
  ]);
  const before1 = JSON.parse(JSON.stringify(line1));
  const before2 = JSON.parse(JSON.stringify(line2));

  lineIntersect(line1, line2);
  t.deepEqual(line1, before1, "line1 input should not be mutated");
  t.deepEqual(line2, before2, "line2 input should not be mutated");
  t.end();
});

test("turf-line-intersect - Geometry Objects", (t) => {
  const line1 = lineString([
    [7, 50],
    [9, 50],
  ]);
  const line2 = lineString([
    [8, 49],
    [8, 51],
  ]);
  t.ok(
    lineIntersect(line1.geometry, line2.geometry).features.length,
    "support Geometry Objects"
  );
  t.ok(
    lineIntersect(featureCollection([line1]), featureCollection([line2]))
      .features.length,
    "support Feature Collection"
  );
  // t.ok(
  //   lineIntersect(
  //     geometryCollection([line1.geometry]),
  //     geometryCollection([line2.geometry])
  //   ).features.length,
  //   "support Geometry Collection"
  // );
  t.end();
});

test("turf-line-intersect - same point #688", (t) => {
  const line1 = lineString([
    [7, 50],
    [8, 50],
    [9, 50],
  ]);
  const line2 = lineString([
    [8, 49],
    [8, 50],
    [8, 51],
  ]);

  const results = lineIntersect(line1, line2);
  t.equal(results.features.length, 1, "should return single point");

  const results2 = lineIntersect(line1, line2, {
    removeDuplicates: false,
  });
  t.equal(results2.features.length, 3, "should return three points");

  t.end();
});

test("turf-line-intersect - polygon support #586", (t) => {
  const poly1 = polygon([
    [
      [7, 50],
      [8, 50],
      [9, 50],
      [7, 50],
    ],
  ]);
  const poly2 = polygon([
    [
      [8, 49],
      [8, 50],
      [8, 51],
      [8, 49],
    ],
  ]);

  const results = lineIntersect(poly1, poly2);
  t.equal(results.features.length, 1, "should return single point");
  t.end();
});

const coords = (fc: GeoJSON.FeatureCollection<Point>) =>
  fc.features
    .map((f) => f.geometry.coordinates)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

test("turf-line-intersect - endpoint on vertical segment #2948", (t) => {
  const line1 = lineString([
    [0, 2],
    [0, 0],
    [4, 0],
    [4, 4],
    [3, 4],
    [3, 1],
    [1, 1],
    [1, 2],
    [0, 2],
  ]);
  const line2 = lineString([
    [3, 2],
    [4, 2],
  ]);

  t.deepEqual(
    coords(lineIntersect(line1, line2)),
    [
      [3, 2],
      [4, 2],
    ],
    "should find both intersections"
  );
  t.deepEqual(
    coords(lineIntersect(line2, line1)),
    [
      [3, 2],
      [4, 2],
    ],
    "should find both intersections with inputs swapped"
  );
  t.end();
});

test("turf-line-intersect - repeated vertex #2948", (t) => {
  const line1 = lineString([
    [2, 2],
    [2, 2],
    [3, 0],
  ]);
  const line2 = lineString([
    [0, 1],
    [4, 1],
  ]);

  t.deepEqual(
    coords(lineIntersect(line1, line2)),
    [[2.5, 1]],
    "should find the intersection"
  );
  t.deepEqual(
    coords(lineIntersect(line2, line1)),
    [[2.5, 1]],
    "should find the intersection with inputs swapped"
  );
  t.end();
});

test("turf-line-intersect - consecutive repeated vertices #2948", (t) => {
  const line1 = lineString([
    [0, 0],
    [2, 6],
    [2, 6],
    [2, 6],
    [4, 0],
    [4, 0],
    [4, 0],
    [6, 6],
  ]);
  const line2 = lineString([
    [0, 3],
    [6, 3],
  ]);

  t.deepEqual(
    coords(lineIntersect(line1, line2)),
    [
      [1, 3],
      [3, 3],
      [5, 3],
    ],
    "should find all intersections"
  );
  t.deepEqual(
    coords(lineIntersect(line2, line1)),
    [
      [1, 3],
      [3, 3],
      [5, 3],
    ],
    "should find all intersections with inputs swapped"
  );
  t.end();
});

test("turf-line-intersect - one-point line on an endpoint #2948", (t) => {
  const line1 = lineString([
    [2, 2],
    [2, 2],
  ]);
  const line2 = lineString([
    [2, 3],
    [0, 3],
    [2, 1],
    [2, 2],
  ]);

  t.deepEqual(
    coords(lineIntersect(line1, line2)),
    [[2, 2]],
    "should find the touch point"
  );
  t.deepEqual(
    coords(lineIntersect(line2, line1)),
    [[2, 2]],
    "should find the touch point with inputs swapped"
  );
  t.end();
});

/**
 * ensures that the self intersection param behaves as expected -
 * since it cannot be verified in the fixture format.
 */
test("turf-line-intersect - self intersection behavior", (t) => {
  const line1: Feature<LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [0, 0],
        [0, 2],
        [2, 1],
        [-1, 1],
      ],
    },
  };
  const line2: Feature<LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [3, 3],
        [4, 4],
        [5, 5],
      ],
    },
  };

  const ignored = lineIntersect(line1, line2);
  t.equal(
    ignored.features.length,
    0,
    "self intersections should be ignored by default"
  );

  const included = lineIntersect(line1, line2, {
    ignoreSelfIntersections: false,
  });
  t.equal(
    included.features.length,
    1,
    "self intersections should be included when ignoreSelfIntersections set to false"
  );
  t.end();
});
