const test = require("tape");
const glob = require("glob");
const path = require("path");
const write = require("write-json-file");
const load = require("load-json-file");
const { featureCollection } = require("@turf/helpers");
const convex = require("./index").default;

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

test("convex hull", (t) => {
  glob.sync(directories.in + "*.geojson").forEach((filepath) => {
    const fileout = filepath.replace("/in/", "/out/");
    const geojson = load.sync(filepath);

    const convexHull = convex(geojson);
    geojson.features.push(convexHull);

    if (process.env.REGEN) write.sync(fileout, geojson);
    t.deepEqual(geojson, load.sync(fileout), path.parse(filepath).name);
  });
  t.end();
});

test("turf-convex -- empty", (t) => {
  t.deepEqual(convex(featureCollection([])), null, "corner case: null hull");
  t.end();
});
