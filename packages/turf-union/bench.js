const fs = require("fs");
const path = require("path");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const union = require("./index").default;
const { featureCollection } = require("@turf/helpers");

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

const suite = new Benchmark.Suite("turf-union");

for (const { name, geojson } of fixtures) {
  suite.add(name, () => {
    union(featureCollection(geojson.features));
  });
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
