const fs = require("fs");
const path = require("path");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const kinks = require("./index").default;

const suite = new Benchmark.Suite("turf-kinks");

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

for (const { name, geojson } of fixtures) {
  suite.add(name, () => {
    kinks(geojson);
  });
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
