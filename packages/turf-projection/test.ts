import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import proj4 from "proj4";
import { writeJsonFileSync } from "write-json-file";
import { clone } from "@turf/clone";
import { point } from "@turf/helpers";
import { truncate } from "@turf/truncate";
import { coordEach } from "@turf/meta";
import { toMercator, toWgs84, proj4ToProj4 } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  mercator: path.join(__dirname, "test", "mercator") + path.sep,
  wgs84: path.join(__dirname, "test", "wgs84") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fromWgs84 = fs.readdirSync(directories.wgs84).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: truncate(loadJsonFileSync(directories.wgs84 + filename)),
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
      writeJsonFileSync(directories.out + "mercator-" + filename, results);
    t.deepEqual(results, truncate(expected), name);
    t.deepEqual(
      results,
      loadJsonFileSync(directories.out + "mercator-" + filename)
    );
  }
  t.end();
});

const fromMercator = fs.readdirSync(directories.mercator).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: truncate(loadJsonFileSync(directories.mercator + filename)),
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
      writeJsonFileSync(directories.out + "wgs84-" + filename, results);
    t.deepEqual(results, truncate(expected), name);
    t.deepEqual(
      results,
      loadJsonFileSync(directories.out + "wgs84-" + filename)
    );
  }
  t.end();
});

test("proj4-to-proj4", (t) => {
  // test wgs84 to mercator
  // compare against saved toMercator results
  for (const { filename, name, geojson } of fromWgs84) {
    const expected = loadJsonFileSync(directories.out + "mercator-" + filename);
    const results = truncate(proj4ToProj4(geojson, "WGS84", "EPSG:900913"));
    t.deepEqual(results, expected);
  }
  // test mercator to wgs84
  // compare against saved toWgs84 results
  for (const { filename, name, geojson } of fromMercator) {
    const expected = loadJsonFileSync(directories.out + "wgs84-" + filename);
    const results = truncate(proj4ToProj4(geojson, "EPSG:900913", "WGS84"));
    t.deepEqual(results, expected);
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
  t.throws(
    () => proj4ToProj4(null, "WGS84", "EPSG:900913"),
    /geojson is required/,
    "throws missing geojson"
  );
  t.throws(
    () => proj4ToProj4(point([0, 0]), null, "EPSG:900913"),
    /inProjection is required/,
    "throws missing inProjection"
  );
  t.throws(
    () => proj4ToProj4(point([0, 0]), "WGS84", null),
    /outProjection is required/,
    "throws missing outProjection"
  );
  t.end();
});

test("projection -- verify mutation", (t) => {
  const pt1 = point([10, 10]);
  const pt2 = point([15, 15]);
  const pt3 = point([20, 20]);
  const pt1Before = clone(pt1);
  const pt2Before = clone(pt2);
  const pt3Before = clone(pt3);

  toMercator(pt1);
  t.deepEqual(
    pt1,
    pt1Before,
    "mutate = undefined - input should NOT be mutated"
  );
  toMercator(pt1, { mutate: false });
  t.deepEqual(pt1, pt1Before, "mutate = false - input should NOT be mutated");
  toMercator(pt1, { mutate: true });
  t.notEqual(pt1, pt1Before, "input should be mutated");

  toWgs84(pt2);
  t.deepEqual(
    pt2,
    pt2Before,
    "mutate = undefined - input should NOT be mutated"
  );
  toWgs84(pt2, { mutate: false });
  t.deepEqual(pt2, pt2Before, "mutate = false - input should NOT be mutated");
  toWgs84(pt2, { mutate: true });
  t.notEqual(pt2, pt2Before, "input should be mutated");

  proj4ToProj4(pt3, "WGS84", "EPSG:900913");
  t.deepEqual(
    pt3,
    pt3Before,
    "mutate = undefined - input should NOT be mutated"
  );
  proj4ToProj4(pt3, "WGS84", "EPSG:900913", { mutate: false });
  t.deepEqual(pt3, pt3Before, "mutate = false - input should NOT be mutated");
  proj4ToProj4(pt3, "WGS84", "EPSG:900913", { mutate: true });
  t.notEqual(pt3, pt3Before, "input should be mutated");

  t.end();
});

test("projection -- handle Position", (t) => {
  const coord = [10, 40];
  const mercator = toMercator(coord);
  const wgs84 = toWgs84(mercator);
  t.deepEqual(coord, wgs84, "coord equal to wgs84");
  const proj4Mercator = proj4ToProj4(coord, "WGS84", "EPSG:900913");
  const proj4Wgs84 = proj4ToProj4(proj4Mercator, "EPSG:900913", "WGS84");
  t.deepEqual(coord, proj4Wgs84,"coord equal to proj4 wgs84");
  t.end();
});
