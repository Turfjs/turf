import path from "path";
import test from "tape";
import { glob } from "glob";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { getCoords } from "@turf/invariant";
import { lineString, featureCollection } from "@turf/helpers";
import { truncate } from "@turf/truncate";
import { destination } from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

test("turf-destination", (t) => {
  glob.sync(directories.in + "*.geojson").forEach((filepath) => {
    const geojson = loadJsonFileSync(filepath);
    const name = path.parse(filepath).name;
    const base = path.parse(filepath).base;

    // Params
    const properties = geojson.properties || {};
    const bearing = properties.bearing !== undefined ? properties.bearing : 180;
    const dist = properties.dist !== undefined ? properties.dist : 100;
    let testProperties = {};
    if (properties.units !== undefined) {
      testProperties.units = properties.units;
    }
    const dest = truncate(destination(geojson, dist, bearing, testProperties));
    const result = featureCollection([
      geojson,
      dest,
      lineString([getCoords(geojson), getCoords(dest)]),
    ]);

    if (process.env.REGEN) writeJsonFileSync(directories.out + base, result);
    t.deepEqual(result, loadJsonFileSync(directories.out + base), name);
  });
  t.end();
});
