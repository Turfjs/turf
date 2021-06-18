import Benchmark from "benchmark";
import { polygon } from "@turf/helpers";
import tesselate from "./index";

var poly = polygon([
  [
    [11, 0],
    [22, 4],
    [31, 0],
    [31, 11],
    [21, 15],
    [11, 11],
    [11, 0],
  ],
]);

/**
 * Benchmark Results
 *
 */
new Benchmark.Suite("turf-tesselate")
  .add("polygon", () => tesselate(poly))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
