import Benchmark, { Event } from "benchmark";
import { polygon } from "@turf/helpers";
import { tesselate } from "./index.js";

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
  .on("cycle", (e: Event) => console.log(String(e.target)))
  .run();
