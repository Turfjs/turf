const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const proj4 = require("proj4");
const write = require("write-json-file");
const clone = require("@turf/clone").default;
const { point } = require("@turf/helpers");
const truncate = require("@turf/truncate").default;
const { coordEach } = require("@turf/meta");
const { toMercator, toWgs84 } = require("./index");

const directories = {
  mercator: path.join(__dirname, "test", "mercator") + path.sep,
  wgs84: path.join(__dirname, "test", "wgs84") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fromWgs84 = fs.readdirSync(directories.wgs84).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: truncate(load.sync(directories.wgs84 + filename)),
  };
});

test("to-mercator", (t) => {
  for (const { filename, name, geojson } of fromWgs84) {
    var expected = clone(geojson);
    coordEach(expected, function (coord) {
      var newCoord = proj4("WGS84", "EPSG:900913", coord);
      coord[0] = newCoord[0];
      coord[1] = newCoord[1];
    });
    const results = truncate(toMercator(geojson));

    if (process.env.REGEN)
      write.sync(directories.out + "mercator-" + filename, results);
    t.deepEqual(results, truncate(expected), name);
    t.deepEqual(results, load.sync(directories.out + "mercator-" + filename));
  }
  t.end();
});

const fromMercator = fs.readdirSync(directories.mercator).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: truncate(load.sync(directories.mercator + filename)),
  };
});

test("to-wgs84", (t) => {
  for (const { filename, name, geojson } of fromMercator) {
    var expected = clone(geojson);
    coordEach(expected, function (coord) {
      var newCoord = proj4("EPSG:900913", "WGS84", coord);
      coord[0] = newCoord[0];
      coord[1] = newCoord[1];
    });
    const results = truncate(toWgs84(geojson));

    if (process.env.REGEN)
      write.sync(directories.out + "wgs84-" + filename, results);
    t.deepEqual(results, truncate(expected), name);
    t.deepEqual(results, load.sync(directories.out + "wgs84-" + filename));
  }
  t.end();
});

test("projection -- throws", (t) => {
  t.throws(
    () => toMercator(null),
    /geojson is required/,
    "throws missing geojson"
  );
  t.throws(
    () => toWgs84(null),
    /geojson is required/,
    "throws missing geojson"
  );
  t.end();
});

test("projection -- verify mutation", (t) => {
  const pt1 = point([10, 10]);
  const pt2 = point([15, 15]);
  const pt1Before = clone(pt1);
  const pt2Before = clone(pt2);

  toMercator(pt1);
  toMercator(pt1, { mutate: false });
  t.deepEqual(
    pt1,
    pt1Before,
    "mutate = undefined - input should NOT be mutated"
  );
  t.deepEqual(pt1, pt1Before, "mutate = false - input should NOT be mutated");
  toMercator(pt1, { mutate: true });
  t.notEqual(pt1, pt1Before, "input should be mutated");

  toWgs84(pt2);
  toWgs84(pt2, { mutate: false });
  t.deepEqual(
    pt2,
    pt2Before,
    "mutate = undefined - input should NOT be mutated"
  );
  t.deepEqual(pt2, pt2Before, "mutate = false - input should NOT be mutated");
  toWgs84(pt2, { mutate: true });
  t.notEqual(pt2, pt2Before, "input should be mutated");

  t.end();
});

test("projection -- handle Position", (t) => {
  const coord = [10, 40];
  const mercator = toMercator(coord);
  const wgs84 = toWgs84(mercator);
  t.deepEqual(coord, wgs84, "coord equal same as wgs84");
  t.end();
});
