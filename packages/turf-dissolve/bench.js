import fs from "fs";
import path from "path";
import load from "load-json-file";
import Benchmark from "benchmark";
import dissolve from "./index";

const directory = path.join(__dirname, "test", "in") + path.sep;
const fixtures = fs.readdirSync(directory).map((filename) => {
  return {
    name: path.parse(filename).name,
    geojson: load.sync(directory + filename),
  };
});

/**
 * Benchmark Results
 *
 * polysByProperty x 6,366 ops/sec ±1.49% (89 runs sampled)
 * polysWithoutProperty x 4,224 ops/sec ±2.34% (77 runs sampled)
 */
const suite = new Benchmark.Suite("turf-dissolve");
for (const { name, geojson } of fixtures) {
  const propertyName = geojson.propertyName;
  suite.add(name, () => dissolve(geojson, { propertyName }));
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
