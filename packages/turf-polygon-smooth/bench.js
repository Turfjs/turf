import fs from "fs";
import path from "path";
import load from "load-json-file";
import Benchmark from "benchmark";
import polygonSmooth from "./index";

const directory = path.join(__dirname, "test", "in") + path.sep;
let fixtures = fs.readdirSync(directory).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directory + filename),
  };
});

/**
 * Benchmark Results
 * close x 88,608 ops/sec ±6.03% (69 runs sampled)
 * geometry x 106,576 ops/sec ±6.95% (68 runs sampled)
 * multipolygon x 88,405 ops/sec ±5.40% (72 runs sampled)
 * polygon x 132,584 ops/sec ±6.75% (79 runs sampled)
 * withHole x 122,725 ops/sec ±2.69% (86 runs sampled)
 */
const suite = new Benchmark.Suite("turf-polygon-smooth");
for (const { name, geojson } of fixtures) {
  suite.add(name, () => polygonSmooth(geojson, { iterations: 3 }));
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
