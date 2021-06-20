const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const { point } = require("@turf/helpers");
const { polygon } = require("@turf/helpers");
const polygonToLine = require("./index").default;

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

test("turf-polygon-to-linestring", (t) => {
  for (const { name, filename, geojson } of fixtures) {
    const results = polygonToLine(geojson);

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEqual(load.sync(directories.out + filename), results, name);
  }
  // Handle Errors
  t.throws(() => polygonToLine(point([10, 5])), "throws - invalid geometry");
  t.throws(() => polygonToLine(polygon([])), "throws - empty coordinates");
  t.end();
});
