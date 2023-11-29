import { point } from "@turf/helpers";
import Benchmark from "benchmark";
import { rhumbDestination as destination } from "./index";

const pt1 = point([-75.0, 39.0]);
const distance = 100;
const bearing = 180;

/**
 * Benchmark Results
 *
 * turf-rhumb-destination x 1,183,462 ops/sec ±3.56% (84 runs sampled)
 */
const suite = new Benchmark.Suite("turf-rhumb-destination");
suite
  .add("turf-rhumb-destination", () =>
    destination(pt1, distance, bearing, "kilometers")
  )
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
