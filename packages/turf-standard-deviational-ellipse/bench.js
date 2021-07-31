import { randomPoint } from "@turf/random";
import standardDeviationalEllipse from "./index";
import Benchmark from "benchmark";

/**
 * Benchmark Results
 *
 * turf-standard-deviational-ellipse - 150 points x 1,874 ops/sec ±5.89% (89 runs sampled)
 * turf-standard-deviational-ellipse - 300 points x 1,092 ops/sec ±0.79% (93 runs sampled)
 * turf-standard-deviational-ellipse - 600 points x 574 ops/sec ±1.14% (92 runs sampled)
 */
const suite = new Benchmark.Suite("turf-standard-deviational-ellipse");
const properties = { bbox: [-10, -10, 10, 10] };
suite
  .add("turf-standard-deviational-ellipse - 150 points", () =>
    standardDeviationalEllipse(randomPoint(150, properties))
  )
  .add("turf-standard-deviational-ellipse - 300 points", () =>
    standardDeviationalEllipse(randomPoint(300, properties))
  )
  .add("turf-standard-deviational-ellipse - 600 points", () =>
    standardDeviationalEllipse(randomPoint(600, properties))
  )
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
