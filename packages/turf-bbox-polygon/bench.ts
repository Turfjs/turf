import Benchmark from "benchmark";
import { bboxPolygon } from "./index";

/**
 * Benchmark Results
 *
 * turf-bbox-polygon x 3,885,828 ops/sec ±1.20% (86 runs sampled)
 */
new Benchmark.Suite("turf-bbox-polygon")
  .add("turf-bbox-polygon", () => bboxPolygon([0, 0, 10, 10]))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
