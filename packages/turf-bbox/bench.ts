import Benchmark from "benchmark";
import { lineString } from "@turf/helpers";
import { bbox } from "./index";

const line = lineString([
  [-74, 40],
  [-78, 42],
  [-82, 35],
]);

/**
 * Benchmark Results
 *
 */
new Benchmark.Suite("turf-bbox")
  .add("line", () => bbox(line))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
