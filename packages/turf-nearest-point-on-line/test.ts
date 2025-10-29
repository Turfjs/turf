import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { along } from "@turf/along";
import { distance } from "@turf/distance";
import { truncate } from "@turf/truncate";
import { length } from "@turf/length";
import {
  lineString,
  multiLineString,
  point,
  featureCollection,
  round,
} from "@turf/helpers";
import { nearestPointOnLine } from "./index.js";

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

test("turf-nearest-point-on-line", (t) => {
  for (const { name, filename, geojson } of fixtures) {
    const [line, point] = geojson.features;
    const onLine = nearestPointOnLine(line, point);
    onLine.properties["marker-color"] = "#F0F";
    onLine.properties.dist = round(onLine.properties.dist, 6);
    onLine.properties.location = round(onLine.properties.location, 6);
    onLine.properties.multiFeatureLocation = round(
      onLine.properties.multiFeatureLocation,
      6
    );
    const between = lineString(
      [onLine.geometry.coordinates, point.geometry.coordinates],
      { stroke: "#F00", "stroke-width": 6 }
    );
    const results = truncate(featureCollection([line, between, point, onLine]));

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEqual(loadJsonFileSync(directories.out + filename), results, name);
  }
  t.end();
});

test("turf-nearest-point-on-line - throws error if invalid arguments", (t) => {
  t.throws(() => {
    nearestPointOnLine(undefined, undefined);
  });
  t.end();
});

test("turf-nearest-point-on-line - first point", (t) => {
  const line = lineString([
    [-122.457175, 37.720033],
    [-122.457175, 37.718242],
  ]);
  const pt = point([-122.457175, 37.720033]);

  const snapped = truncate(nearestPointOnLine(line, pt));

  t.deepEqual(
    pt.geometry.coordinates,
    snapped.geometry.coordinates,
    "pt on start does not move"
  );
  t.equal(
    Number(snapped.properties.location.toFixed(6)),
    0,
    "properties.location"
  );

  t.end();
});

test("turf-nearest-point-on-line - points behind first point", (t) => {
  const line = lineString([
    [-122.457175, 37.720033],
    [-122.457175, 37.718242],
  ]);
  const first = point(line.geometry.coordinates[0]);
  const pts = [
    point([-122.457175, 37.720093]),
    point([-122.457175, 37.820093]),
    point([-122.457165, 37.720093]),
    point([-122.455165, 37.720093]),
  ];
  const expectedLocation = [0, 0, 0, 0];

  pts.forEach((pt) => {
    const snapped = truncate(nearestPointOnLine(line, pt));
    t.deepEqual(
      snapped.geometry.coordinates,
      first.geometry.coordinates,
      "pt behind start moves to first vertex"
    );
    expectedLocation.push(Number(snapped.properties.location.toFixed(6)));
  });

  const filepath =
    directories.out + "expectedLocation - points behind first point.json";
  if (process.env.REGEN) writeJsonFileSync(filepath, expectedLocation);
  t.deepEqual(
    loadJsonFileSync(filepath),
    expectedLocation,
    "properties.location"
  );
  t.end();
});

test("turf-nearest-point-on-line - points in front of last point", (t) => {
  const line = lineString([
    [-122.456161, 37.721259],
    [-122.457175, 37.720033],
    [-122.457175, 37.718242],
  ]);
  const last = point(
    line.geometry.coordinates[line.geometry.coordinates.length - 1]
  );
  const pts = [
    point([-122.45696, 37.71814]),
    point([-122.457363, 37.718132]),
    point([-122.457309, 37.717979]),
    point([-122.45718, 37.717045]),
  ];
  const expectedLocation: number[] = [];

  pts.forEach((pt) => {
    const snapped = truncate(nearestPointOnLine(line, pt));
    t.deepEqual(
      snapped.geometry.coordinates,
      last.geometry.coordinates,
      "pt behind start moves to last vertex"
    );
    expectedLocation.push(Number(snapped.properties.location.toFixed(6)));
  });

  const filepath =
    directories.out + "expectedLocation - points in front of last point.json";
  if (process.env.REGEN) writeJsonFileSync(filepath, expectedLocation);
  t.deepEqual(
    loadJsonFileSync(filepath),
    expectedLocation,
    "properties.location"
  );
  t.end();
});

test("turf-nearest-point-on-line - points on joints", (t) => {
  const lines = [
    lineString([
      [-122.456161, 37.721259],
      [-122.457175, 37.720033],
      [-122.457175, 37.718242],
    ]),
    lineString([
      [26.279296, 31.728167],
      [21.796875, 32.694865],
      [18.808593, 29.993002],
      [12.919921, 33.137551],
      [10.195312, 35.603718],
      [4.921875, 36.527294],
      [-1.669921, 36.527294],
      [-5.449218, 34.741612],
      [-8.789062, 32.990235],
    ]),
    lineString([
      [-0.109198, 51.522042],
      [-0.10923, 51.521942],
      [-0.109165, 51.521862],
      [-0.109047, 51.521775],
      [-0.108865, 51.521601],
      [-0.108747, 51.521381],
      [-0.108554, 51.520687],
      [-0.108436, 51.520279],
      [-0.108393, 51.519952],
      [-0.108178, 51.519578],
      [-0.108146, 51.519285],
      [-0.107899, 51.518624],
      [-0.107599, 51.517782],
    ]),
  ];
  const expectedLocation: number[] = [];

  lines.forEach((line, i) => {
    line.geometry.coordinates
      .map((coord) => {
        return point(coord);
      })
      .forEach((pt, j) => {
        const snapped = truncate(nearestPointOnLine(line, pt));
        t.deepEqual(
          snapped.geometry.coordinates,
          pt.geometry.coordinates,
          "pt on joint stayed in place"
        );
        if (!expectedLocation[i]) expectedLocation[i] = [];
        expectedLocation[i][j] = Number(snapped.properties.location.toFixed(6));
      });
  });

  const filepath = directories.out + "expectedLocation - points on joints.json";
  if (process.env.REGEN) writeJsonFileSync(filepath, expectedLocation);
  t.deepEqual(
    expectedLocation,
    loadJsonFileSync(filepath),
    "properties.location"
  );
  t.end();
});

test("turf-nearest-point-on-line - points on top of line", (t) => {
  const line = lineString([
    [-0.109198, 51.522042],
    [-0.10923, 51.521942],
    [-0.109165, 51.521862],
    [-0.109047, 51.521775],
    [-0.108865, 51.521601],
    [-0.108747, 51.521381],
    [-0.108554, 51.520687],
    [-0.108436, 51.520279],
    [-0.108393, 51.519952],
    [-0.108178, 51.519578],
    [-0.108146, 51.519285],
    [-0.107899, 51.518624],
    [-0.107599, 51.517782],
  ]);
  const expectedLocation = [];

  const dist = length(line, { units: "miles" });
  const increment = dist / 10;

  for (let i = 0; i < 10; i++) {
    const pt = along(line, increment * i, { units: "miles" });
    const snapped = nearestPointOnLine(line, pt, { units: "miles" });
    const shift = distance(pt, snapped, { units: "miles" });
    t.true(shift < 0.000001, "pt did not shift far");
    expectedLocation.push(Number(snapped.properties.location.toFixed(6)));
  }

  const filepath =
    directories.out + "expectedLocation - points on top of line.json";
  if (process.env.REGEN) writeJsonFileSync(filepath, expectedLocation);
  t.deepEqual(
    expectedLocation,
    loadJsonFileSync(filepath),
    "properties.location"
  );
  t.end();
});

test("turf-nearest-point-on-line - point along line", (t) => {
  const line = lineString([
    [-122.457175, 37.720033],
    [-122.457175, 37.718242],
  ]);

  const pt = along(line, 0.019, { units: "miles" });
  const snapped = nearestPointOnLine(line, pt);
  const shift = distance(pt, snapped, { units: "miles" });

  t.true(shift < 0.00001, "pt did not shift far");

  t.end();
});

test("turf-nearest-point-on-line - points on sides of lines", (t) => {
  const line = lineString([
    [-122.456161, 37.721259],
    [-122.457175, 37.718242],
  ]);
  const first = line.geometry.coordinates[0];
  const last = line.geometry.coordinates[line.geometry.coordinates.length - 1];
  const pts = [
    point([-122.457025, 37.71881]),
    point([-122.457336, 37.719235]),
    point([-122.456864, 37.72027]),
    point([-122.45652, 37.720635]),
  ];

  pts.forEach((pt) => {
    const snapped = nearestPointOnLine(line, pt);
    t.notDeepEqual(
      snapped.geometry.coordinates,
      first,
      "pt did not snap to first vertex"
    );
    t.notDeepEqual(
      snapped.geometry.coordinates,
      last,
      "pt did not snap to last vertex"
    );
  });

  t.end();
});

test("turf-nearest-point-on-line - check dist and index", (t) => {
  const line = lineString([
    [-92.090492, 41.102897],
    [-92.191085, 41.079868],
    [-92.228507, 41.056055],
    [-92.237091, 41.008143],
    [-92.225761, 40.966937],
    [-92.15023, 40.936858],
    [-92.112464, 40.977565],
    [-92.062683, 41.034564],
    [-92.100791, 41.040002],
  ]);
  const pt = point([-92.110576, 41.040649]);
  const snapped = truncate(nearestPointOnLine(line, pt));

  t.equal(snapped.properties.index, 8, "properties.index");
  t.equal(
    Number(snapped.properties.dist.toFixed(6)),
    0.823802,
    "properties.dist"
  );
  t.deepEqual(
    snapped.geometry.coordinates,
    [-92.100791, 41.040002],
    "coordinates"
  );

  t.end();
});

test("turf-nearest-point-on-line -- Issue #691", (t) => {
  const line1 = lineString([
    [7, 50],
    [8, 50],
    [9, 50],
  ]);
  const pointAlong = along(line1, 10);
  const { location } = nearestPointOnLine(line1, pointAlong).properties;

  t.false(isNaN(location));
  t.end();
});

test("turf-nearest-point-on-line -- Geometry Support", (t) => {
  const pt = point([7, 55]);
  const line = lineString([
    [7, 50],
    [8, 50],
    [9, 50],
  ]);
  const multiLine = multiLineString([
    [
      [7, 50],
      [8, 50],
      [9, 50],
    ],
    [
      [17, 30],
      [4, 30],
      [2, 30],
    ],
  ]);
  t.assert(nearestPointOnLine(line.geometry, pt), "line Geometry");
  t.assert(nearestPointOnLine(multiLine.geometry, pt), "multiLine Geometry");
  t.assert(nearestPointOnLine(line, pt.geometry), "point Geometry");
  t.assert(
    nearestPointOnLine(line, pt.geometry.coordinates),
    "point Coordinates"
  );
  t.end();
});

test("turf-nearest-point-on-line -- multifeature index", (t) => {
  const pt = point([4, 30]);
  const multiLine = multiLineString([
    [
      [7, 50],
      [8, 50],
      [9, 50],
    ],
    [
      [17, 30],
      [4, 30],
      [2, 30],
    ],
  ]);
  t.equal(
    nearestPointOnLine(multiLine.geometry, pt).properties.multiFeatureIndex,
    1,
    "multiFeatureIndex"
  );
  t.end();
});

test("turf-nearest-point-on-line -- issue 2753 multifeature location", (t) => {
  const multiLine = multiLineString([
    [
      [-122.3125, 47.6632],
      [-122.3102, 47.6646],
    ],
    [
      [-122.3116, 47.6623],
      [-122.3091, 47.6636],
    ],
  ]);

  const ptA = point([-122.3106, 47.6638], { name: "A" });
  const ptB = point([-122.3102, 47.6634], { name: "B" });

  const nearestToA = nearestPointOnLine(multiLine, ptA, { units: "meters" });
  const nearestToB = nearestPointOnLine(multiLine, ptB, { units: "meters" });

  t.equal(
    Number(nearestToA.properties.multiFeatureLocation.toFixed(6)),
    150.296465,
    "nearestToA multiFeatureLocation"
  );
  t.equal(
    Number(nearestToB.properties.multiFeatureLocation.toFixed(6)),
    157.738215,
    "nearestToB multiFeatureLocation"
  );
  t.end();
});

test("turf-nearest-point-on-line -- issue 1514", (t) => {
  const pt = point([-40.01, 56]);
  const line = lineString([
    [-40, 50],
    [-40, 60],
  ]);

  const nearest = nearestPointOnLine(line, pt, { units: "meters" });

  t.deepEqual(
    truncate(nearest, { precision: 8 }).geometry.coordinates,
    [-40, 56.0000004],
    "nearest point should be [-40, 56.0000004]"
  );
  t.end();
});

test("turf-nearest-point-on-line -- issue 965", (t) => {
  const pt = point([-1.75, 50.02876666663333]);
  const line = lineString([
    [-76.42916666666666, 36.967333333333336],
    [-76.43083333333334, 36.96516666666667],
    [-76.43033333333334, 36.962833333333336],
    [-76.416, 36.95466666666667],
    [-76.4075, 36.953833333333336],
    [-76.3555, 36.959],
    [-76.35083333333333, 36.96083333333333],
    [-76.3405, 36.96783333333333],
    [-76.29766666666667, 37.00066666666667],
    [-76.25, 37.00966666666667],
    [-76.015, 36.95],
    [-75.975, 36.94166666666667],
    [-75.92166666666667, 36.916666666666664],
    [-75.87, 36.87166666666667],
    [-75.78083333333333, 36.82666666666667],
    [-75.76333333333334, 36.81],
    [-75.64433333333334, 36.81],
    [-2.75, 49.81666666666667],
    [0.9866666666666667, 50.49333333333333],
    [1.335, 50.68],
    [1.4849999999999999, 50.89833333333333],
    [1.7516666666666667, 51.10333333333333],
    [2.1666666666666665, 51.25666666666667],
    [2.5, 51.36666666666667],
    [2.71, 51.36666666666667],
    [2.8116666666666665, 51.42333333333333],
    [2.881666666666667, 51.42166666666667],
    [2.965, 51.415],
    [3.046666666666667, 51.413333333333334],
    [3.1066666666666665, 51.39833333333333],
    [3.25, 51.41],
    [3.3033333333333332, 51.406666666666666],
    [3.3333333333333335, 51.406666666666666],
    [3.36, 51.40833333333333],
    [3.408333333333333, 51.4075],
    [3.6, 51.43],
    [3.6466666666666665, 51.43966666666667],
    [3.6683333333333334, 51.43866666666667],
    [3.71, 51.415333333333336],
    [3.711666666666667, 51.39083333333333],
    [3.720833333333333, 51.37833333333333],
    [3.751666666666667, 51.365],
    [3.8133333333333335, 51.346666666666664],
    [3.8466666666666667, 51.345],
    [3.888333333333333, 51.354166666666664],
    [3.9283333333333332, 51.37083333333333],
    [3.9466666666666668, 51.384166666666665],
    [3.9783333333333335, 51.435],
    [3.9966666666666666, 51.4375],
    [4.015, 51.43333333333333],
    [4.03, 51.4225],
    [4.035, 51.39],
    [4.045, 51.37833333333333],
    [4.069166666666667, 51.37166666666667],
    [4.101666666666667, 51.36866666666667],
    [4.133333333333334, 51.37166666666667],
    [4.147, 51.37416666666667],
    [4.181333333333333, 51.39666666666667],
    [4.190666666666667, 51.39833333333333],
    [4.200833333333334, 51.39833333333333],
    [4.2091666666666665, 51.39416666666666],
    [4.221333333333333, 51.36533333333333],
    [4.2396666666666665, 51.355],
    [4.261666666666667, 51.348333333333336],
    [4.275, 51.34466666666667],
    [4.293333333333333, 51.343333333333334],
    [4.2988333333333335, 51.34166666666667],
    [4.308333333333334, 51.325],
    [4.314666666666667, 51.329],
    [4.316666666666666, 51.32633333333333],
  ]);

  const nearest = nearestPointOnLine(line, pt, { units: "meters" });

  t.deepEqual(
    truncate(nearest, { precision: 8 }).geometry.coordinates,
    [-1.74267971, 50.01283081],
    "nearest point should be [-1.74267971, 50.01283081]"
  );
  t.end();
});

test("turf-nearest-point-on-line -- issue 2808 redundant point support", (t) => {
  // include redundant points in line
  const line1 = lineString([
    [10.57846, 49.8463959],
    [10.57846, 49.8468386],
    [10.57846, 49.8468386],
    [10.57846, 49.8468386],
    [10.57846, 49.8472814],
    [10.57846, 49.8472814],
  ]);
  const thePoint = point([10.57846, 49.8468386]);

  const nearest = nearestPointOnLine(line1, thePoint); // should not throw
  t.equal(nearest.properties.dist, 0, "redundant point should not throw");

  t.end();
});
