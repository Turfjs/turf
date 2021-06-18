import Benchmark from "benchmark";
import { polygon } from "@turf/helpers";
import planepoint from "./index";

const point = [1, 1];
const triangle = polygon(
  [
    [
      [0, 0, 0],
      [2, 0, 0],
      [1, 2, 2],
      [0, 0, 0],
    ],
  ],
  { a: 0, b: 0, c: 2 }
);

/**
 * Benchmmark Results
 *
 * turf-planepoint x 14,905,445 ops/sec ±4.54% (75 runs sampled)
 */
const suite = new Benchmark.Suite("turf-planepoint");
suite
  .add("turf-planepoint", () => planepoint(point, triangle))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
