const { point } = require("@turf/helpers");
const Benchmark = require("benchmark");
const destination = require("./index").default;

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
