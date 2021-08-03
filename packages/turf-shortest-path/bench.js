import fs from "fs";
import path from "path";
import load from "load-json-file";
import Benchmark from "benchmark";
import shortestPath from "./index";

const directory = path.join(__dirname, "test", "in") + path.sep;
const fixtures = fs.readdirSync(directory).map((filename) => {
  const geojson = load.sync(directory + filename);
  return {
    name: path.parse(filename).name,
    start: geojson.features.shift(),
    end: geojson.features.shift(),
    options: Object.assign({}, geojson.properties, { obstacles: geojson }),
  };
});

/**
 * Single Process Benchmark
 *
 * simple: 57.895ms
 */
for (const { name, start, end, options } of fixtures) {
  console.time(name);
  shortestPath(start, end, options);
  console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * simple x 129 ops/sec ±4.53% (65 runs sampled)
 */
const suite = new Benchmark.Suite("turf-shortest-path");
for (const { name, start, end, options } of fixtures) {
  suite.add(name, () => shortestPath(start, end, options));
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
