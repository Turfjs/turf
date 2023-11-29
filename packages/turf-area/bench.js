const fs = require("fs");
const path = require("path");
const { loadJsonFileSync } = require("load-json-file");
const Benchmark = require("benchmark");
const area = require("./index").default;

// Define fixtures
const directory = path.join(__dirname, "test", "in") + path.sep;
const fixtures = fs.readdirSync(directory).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directory + filename),
  };
});

/**
 * Benmark Results
 *
 * polygon x 8,510,024 ops/sec ±0.28% (96 runs sampled)
 */

// Define benchmark
const suite = new Benchmark.Suite("turf-area");
for (const { name, geojson } of fixtures) {
  suite.add(name, () => area(geojson));
}
suite.on("cycle", (e) => console.log(String(e.target))).run();
