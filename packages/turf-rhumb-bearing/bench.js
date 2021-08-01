const { point } = require("@turf/helpers");
const Benchmark = require("benchmark");
const rhumbBearing = require("./index").default;

var start = point([-75.4, 39.4]);
var end = point([-75.534, 39.123]);

/**
 * Benchmark Results
 *
 * initial bearing x 1,108,233 ops/sec ±3.22% (86 runs sampled)
 * final bearing x 1,144,822 ops/sec ±2.01% (88 runs sampled)
 */
var suite = new Benchmark.Suite("turf-rhumb-bearing");
suite
  .add("initial bearing", () => rhumbBearing(start, end))
  .add("final bearing", () => rhumbBearing(start, end, true))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
