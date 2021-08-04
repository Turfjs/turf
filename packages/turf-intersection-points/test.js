const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const truncate = require("@turf/truncate").default;
const {
  featureCollection,
  // geometryCollection,
  lineString,
  polygon,
} = require("@turf/helpers");
const intersectionPoints = require("./index").default;

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

test("turf-intersection-points", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const [line1, line2] = geojson.features;
    const results = truncate(intersectionPoints(line1, line2));
    results.features.push(line1);
    results.features.push(line2);

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);
  }
  t.end();
});

test("turf-intersection-points - prevent input mutation", (t) => {
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

  intersectionPoints(line1, line2);
  t.deepEqual(line1, before1, "line1 input should not be mutated");
  t.deepEqual(line2, before2, "line2 input should not be mutated");
  t.end();
});

test("turf-intersection-points - Geometry Objects", (t) => {
  const line1 = lineString([
    [7, 50],
    [9, 50],
  ]);
  const line2 = lineString([
    [8, 49],
    [8, 51],
  ]);
  t.ok(
    intersectionPoints(line1.geometry, line2.geometry).features.length,
    "support Geometry Objects"
  );
  t.ok(
    intersectionPoints(featureCollection([line1]), featureCollection([line2]))
      .features.length,
    "support Feature Collection"
  );
  // t.ok(
  //   intersectionPoints(
  //     geometryCollection([line1.geometry]),
  //     geometryCollection([line2.geometry])
  //   ).features.length,
  //   "support Geometry Collection"
  // );
  t.end();
});

test("turf-intersection-points - same point #688", (t) => {
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

  const results = intersectionPoints(line1, line2);
  t.equal(results.features.length, 1, "should return single point");

  const results2 = intersectionPoints(line1, line2, {
    removeDuplicates: false,
  });
  t.equal(results2.features.length, 3, "should return three points");

  t.end();
});

test("turf-intersection-points - polygon support #586", (t) => {
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

  const results = intersectionPoints(poly1, poly2);
  t.equal(results.features.length, 1, "should return single point");
  t.end();
});
