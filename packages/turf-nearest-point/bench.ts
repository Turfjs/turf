import path from "path";
import Benchmark from "benchmark";
import { loadJsonFileSync } from "load-json-file";
import { nearestPoint } from "./index";

const pts = loadJsonFileSync(path.join(__dirname, "test", "in", "points.json"));

/**
 * Benchmark Results
 *
 * turf-nearest-point x 72,623 ops/sec ±9.23% (73 runs sampled)
 */
const suite = new Benchmark.Suite("turf-nearest-point");
suite
  .add("turf-nearest-point", () =>
    nearestPoint(pts.properties.targetPoint, pts)
  )
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
