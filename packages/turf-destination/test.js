const path = require("path");
const test = require("tape");
const glob = require("glob");
const load = require("load-json-file");
const write = require("write-json-file");
const { getCoords } = require("@turf/invariant");
const { lineString, featureCollection } = require("@turf/helpers");
const truncate = require("@turf/truncate").default;
const destination = require("./index").default;

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

test("turf-destination", (t) => {
  glob.sync(directories.in + "*.geojson").forEach((filepath) => {
    const geojson = load.sync(filepath);
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

    if (process.env.REGEN) write.sync(directories.out + base, result);
    t.deepEqual(result, load.sync(directories.out + base), name);
  });
  t.end();
});
