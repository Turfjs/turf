import fs from "fs";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import Benchmark from "benchmark";
import { area } from "./index";

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
