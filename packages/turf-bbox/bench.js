const Benchmark = require("benchmark");
const { lineString } = require("@turf/helpers");
const bbox = require("./index").default;

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
