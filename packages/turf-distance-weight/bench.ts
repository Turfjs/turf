import Benchmark from "benchmark";
import { distanceWeight } from "./index";
import path from "path";
import { loadJsonFileSync } from "load-json-file";

/**
 * Benchmark Results
 *
 * point: 1.919ms
 * point x 22,881 ops/sec ±0.68% (97 runs sampled)
 */
const suite = new Benchmark.Suite("turf-distance-weight");

const columbusPath = path.join(__dirname, "test", "in", "point.json");
const columbusJson = loadJsonFileSync(columbusPath);
const { name } = path.parse(columbusPath);

console.time(name);
distanceWeight(columbusJson);
console.timeEnd(name);

suite.add(name, () => distanceWeight(columbusJson));

suite.on("cycle", (e) => console.log(String(e.target))).run();
