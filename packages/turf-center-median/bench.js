const Benchmark = require("benchmark");
const { randomPoint } = require("@turf/random");
const centerMedian = require("./index").default;

/**
 * Benchmark Results
 *
 * turf-center-median - 100 points x 1,900 ops/sec ±1.39% (86 runs sampled)
 * turf-center-median - 200 points x 1,031 ops/sec ±1.01% (90 runs sampled)
 * turf-center-median - 500 points x 442 ops/sec ±1.27% (75 runs sampled)
 */
const suite = new Benchmark.Suite("turf-center-median");

suite
  .add("turf-center-median - 100 points", () => centerMedian(randomPoint(100)))
  .add("turf-center-median - 200 points", () => centerMedian(randomPoint(200)))
  .add("turf-center-median - 500 points", () => centerMedian(randomPoint(500)))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
