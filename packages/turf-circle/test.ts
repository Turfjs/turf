import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { featureCollection } from "@turf/helpers";
import { check } from "@placemarkio/check-geojson";
import { circle } from "./index";

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

test("turf-circle", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const properties = geojson.properties || {};
    const radius = properties.radius;
    const steps = properties.steps || 64;
    const units = properties.units;

    const C = truncate(circle(geojson, radius, { steps: steps, units: units }));
    const results = featureCollection([geojson, C]);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  });
  t.end();
});

test("turf-circle -- validate geojson", (t) => {
  const C = circle([0, 0], 100);
  try {
    check(JSON.stringify(C));
    t.pass();
  } catch (e) {
    t.fail(e.message);
  }
  t.end();
});
