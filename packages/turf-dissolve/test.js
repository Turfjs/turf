import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import { polygon, point, featureCollection } from "@turf/helpers";
import dissolve from "./index";

const SKIP = [];

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

test("turf-dissolve", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    if (-1 !== SKIP.indexOf(filename)) {
      continue;
    }
    const propertyName = geojson.propertyName;
    const results = dissolve(geojson, { propertyName });

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);
  }
  t.end();
});

test("dissolve -- throw", (t) => {
  const poly = polygon([
    [
      [-61, 27],
      [-59, 27],
      [-59, 29],
      [-61, 29],
      [-61, 27],
    ],
  ]);
  const pt = point([-62, 29]);

  t.throws(
    () => dissolve(null),
    /No featureCollection passed/,
    "missing featureCollection"
  );
  t.throws(
    () => dissolve(poly),
    /Invalid input to dissolve, FeatureCollection required/,
    "invalid featureCollection"
  );
  t.throws(
    () => dissolve(featureCollection([poly, pt])),
    /Invalid input to dissolve: must be a Polygon, given Point/,
    "invalid collection type"
  );
  t.end();
});

test("dissolve -- properties", (t) => {
  var features = featureCollection([
    polygon(
      [
        [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0],
        ],
      ],
      { combine: "yes" }
    ),
    polygon(
      [
        [
          [0, -1],
          [0, 0],
          [1, 0],
          [1, -1],
          [0, -1],
        ],
      ],
      { combine: "yes" }
    ),
    polygon(
      [
        [
          [1, -1],
          [1, 0],
          [2, 0],
          [2, -1],
          [1, -1],
        ],
      ],
      { combine: "no" }
    ),
  ]);

  var results = dissolve(features, { propertyName: "combine" });
  t.equals(results.features[0].properties.combine, "yes");
  t.equals(results.features[1].properties.combine, "no");

  t.end();
});
