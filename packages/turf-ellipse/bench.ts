import Benchmark from "benchmark";
import { ellipse, ellipseOld, ellipseRiemann } from "./index.js";

/**
 * Benchmark Results
 *
 * turf-ellipse - 8 steps x 1,691,641 ops/sec ±1.88% (84 runs sampled)
 * turf-ellipse - 64 steps x 179,814 ops/sec ±2.23% (85 runs sampled)
 * turf-ellipse - 256 steps x 45,268 ops/sec ±2.33% (87 runs sampled)
 *
 */
const suite = new Benchmark.Suite("turf-ellipse");
const center = [-73.9975, 40.730833];
const xSemiAxis = 50;
const ySemiAxis = 10;

suite
  // .add("turf-ellipse - 8 steps", () =>
  //   ellipse(center, xSemiAxis, ySemiAxis, { steps: 8 })
  // )
  // .add("turf-ellipse - 64 steps", () =>
  //   ellipse(center, xSemiAxis, ySemiAxis, { steps: 64 })
  // )
  .add("turf-ellipse - old", () => ellipseOld(center, xSemiAxis, ySemiAxis, {}))
  .add("turf-ellipse - new q1", () =>
    ellipse(center, xSemiAxis, ySemiAxis, { accuracy: 1 })
  )
  .add("turf-ellipse - new q2", () =>
    ellipse(center, xSemiAxis, ySemiAxis, { accuracy: 2 })
  )
  .add("turf-ellipse - new q3", () =>
    ellipse(center, xSemiAxis, ySemiAxis, { accuracy: 3 })
  )
  .add("turf-ellipse - riemann", () =>
    ellipseRiemann(center, xSemiAxis, ySemiAxis, {})
  )

  .on("cycle", (e) => console.log(String(e.target)))
  .run();
