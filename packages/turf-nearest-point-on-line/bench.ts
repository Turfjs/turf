import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import Benchmark, { Event } from "benchmark";
import { nearestPointOnLine } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directory = path.join(__dirname, "test", "in") + path.sep;
const fixtures = fs.readdirSync(directory).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directory + filename),
  };
});

/**
 * Benchmark Results
 *
 * ==after (@turf/line-intersect)==
 * line1 x 234,231 ops/sec ±1.78% (88 runs sampled)
 * route1 x 161 ops/sec ±1.53% (80 runs sampled)
 * route2 x 184 ops/sec ±1.96% (80 runs sampled)
 *
 * ==before (original)==
 * line1 x 272,785 ops/sec ±1.29% (87 runs sampled)
 * route1 x 195 ops/sec ±2.23% (80 runs sampled)
 * route2 x 218 ops/sec ±2.42% (78 runs sampled)
 */
let totalTime = 0.0;
const suite = new Benchmark.Suite("turf-nearest-point-on-line");
for (const { name, geojson } of fixtures) {
  const [line, point] = geojson.features;
  suite.add(name, () => nearestPointOnLine(line, point), {
    onComplete: (e: Event) =>
      (totalTime = totalTime += e.target.times?.elapsed),
  });
}

suite
  .on("cycle", (e: Event) => console.log(String(e.target)))
  .on("complete", () =>
    console.log(`completed in ${totalTime.toFixed(2)} seconds`)
  )
  .run();
