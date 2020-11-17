import fs from "fs";
import path from "path";
import test from "tape";
import load from "load-json-file";
import write from "write-json-file";
import { featureEach } from "@turf/meta";
import kinks from "@turf/kinks";
import unkinkPolygon from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return { filename, geojson: load.sync(directories.in + filename) };
});

test("unkink-polygon", (t) => {
  for (const { filename, geojson } of fixtures) {
    const unkinked = unkinkPolygon(geojson);

    // Detect if kinks exists
    featureEach(unkinked, (feature) => {
      // Throw Error when Issue #1094 is fixed
      if (kinks(feature).features.length) t.skip(filename + " has kinks");
    });

    if (process.env.REGEN) write.sync(directories.out + filename, unkinked);

    const expected = load.sync(directories.out + filename);
    t.deepEquals(unkinked, expected, path.parse(filename).name);
  }
  t.end();
});

test("unkink-polygon -- throws", (t) => {
  var array = [1, 2, 3, 4, 5];
  for (const value in array) {
    t.true(value !== "isUnique", "isUnique");
    t.true(value !== "getUnique", "getUnique");
  }
  t.throws(() => Array.isUnique(), "isUnique()");
  t.throws(() => Array.getUnique(), "getUnique()");
  t.end();
});
