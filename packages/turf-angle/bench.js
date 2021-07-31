const Benchmark = require("benchmark");
const angle = require("./index").default;

/**
 * Benchmark Results
 *
 * angle x 980,468 ops/sec ±1.30% (84 runs sampled)
 * angle -- meractor x 931,748 ops/sec ±1.27% (88 runs sampled)
 */
new Benchmark.Suite("turf-angle")
  .add("angle", () => angle([5, 5], [5, 6], [3, 4]))
  .add("angle -- meractor", () =>
    angle([5, 5], [5, 6], [3, 4], { mercator: true })
  )
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
