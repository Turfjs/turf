const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const along = require("@turf/along").default;
const distance = require("@turf/distance").default;
const truncate = require("@turf/truncate").default;
const length = require("@turf/length").default;
const {
  lineString,
  multiLineString,
  point,
  featureCollection,
  round,
} = require("@turf/helpers");
const nearestPointOnLine = require("./index").default;

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename),
  };
});

test("turf-linestring-to-polygon", (t) => {
  for (const { name, filename, geojson } of fixtures) {
    const [line, point] = geojson.features;
    const onLine = nearestPointOnLine(line, point);
    onLine.properties["marker-color"] = "#F0F";
    onLine.properties.dist = round(onLine.properties.dist, 6);
    onLine.properties.location = round(onLine.properties.location, 6);
    const between = lineString(
      [onLine.geometry.coordinates, point.geometry.coordinates],
      { stroke: "#F00", "stroke-width": 6 }
    );
    const results = truncate(featureCollection([line, between, point, onLine]));

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEqual(load.sync(directories.out + filename), results, name);
  }
  t.end();
});

test("turf-point-on-line - throws error if invalid arguments", (t) => {
  t.throws(() => {
    nearestPointOnLine(undefined, undefined);
  });
  t.end();
});

test("turf-point-on-line - first point", (t) => {
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

test("turf-point-on-line - points behind first point", (t) => {
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
      first.geometry.coordinates,
      snapped.geometry.coordinates,
      "pt behind start moves to first vertex"
    );
    expectedLocation.push(Number(snapped.properties.location.toFixed(6)));
  });

  const filepath =
    directories.out + "expectedLocation - points behind first point.json";
  if (process.env.REGEN) write.sync(filepath, expectedLocation);
  t.deepEqual(load.sync(filepath), expectedLocation, "properties.location");
  t.end();
});

test("turf-point-on-line - points in front of last point", (t) => {
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
  const expectedLocation = [];

  pts.forEach((pt) => {
    const snapped = truncate(nearestPointOnLine(line, pt));
    t.deepEqual(
      last.geometry.coordinates,
      snapped.geometry.coordinates,
      "pt behind start moves to last vertex"
    );
    expectedLocation.push(Number(snapped.properties.location.toFixed(6)));
  });

  const filepath =
    directories.out + "expectedLocation - points in front of last point.json";
  if (process.env.REGEN) write.sync(filepath, expectedLocation);
  t.deepEqual(load.sync(filepath), expectedLocation, "properties.location");
  t.end();
});

test("turf-point-on-line - points on joints", (t) => {
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
  const expectedLocation = [];

  lines.forEach((line, i) => {
    line.geometry.coordinates
      .map((coord) => {
        return point(coord);
      })
      .forEach((pt, j) => {
        const snapped = truncate(nearestPointOnLine(line, pt));
        t.deepEqual(
          pt.geometry.coordinates,
          snapped.geometry.coordinates,
          "pt on joint stayed in place"
        );
        if (!expectedLocation[i]) expectedLocation[i] = [];
        expectedLocation[i][j] = Number(snapped.properties.location.toFixed(6));
      });
  });

  const filepath = directories.out + "expectedLocation - points on joints.json";
  if (process.env.REGEN) write.sync(filepath, expectedLocation);
  t.deepEqual(load.sync(filepath), expectedLocation, "properties.location");
  t.end();
});

test("turf-point-on-line - points on top of line", (t) => {
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
  if (process.env.REGEN) write.sync(filepath, expectedLocation);
  t.deepEqual(load.sync(filepath), expectedLocation, "properties.location");
  t.end();
});

test("turf-point-on-line - point along line", (t) => {
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

test("turf-point-on-line - points on sides of lines", (t) => {
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

test("turf-point-on-line - check dist and index", (t) => {
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

test("turf-point-on-line -- Issue #691", (t) => {
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

test("turf-point-on-line -- Geometry Support", (t) => {
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
