const Benchmark = require("benchmark");
const { polygon } = require("@turf/helpers");
const grid = require("./index").default;

var bbox = [-95, 30, -85, 40];
var mask = polygon([
  [
    [6.5, 44.6],
    [9.2, 44.8],
    [8.3, 46.4],
    [6.5, 44.6],
  ],
]);

var highres = grid(bbox, 100, { units: "miles" }).features.length;
var midres = grid(bbox, 10, { units: "miles" }).features.length;
var lowres = grid(bbox, 1, { units: "miles" }).features.length;
var masked = grid(mask, 1, { units: "miles", mask: mask }).features.length;
var suite = new Benchmark.Suite("turf-square-grid");

/**
 * Benchmark Results
 *
 * highres -- 42 cells x 274,666 ops/sec ±1.96% (77 runs sampled)
 * midres  -- 4200 cells x 2,725 ops/sec ±3.86% (73 runs sampled)
 * lowres  -- 414508 cells x 2.09 ops/sec ±21.02% (10 runs sampled)
 * masked  -- 7658 cells x 9,794 ops/sec ±2.08% (75 runs sampled)
 */
suite
  .add("highres -- " + highres + " cells", () =>
    grid(bbox, 100, { units: "miles" })
  )
  .add("midres  -- " + midres + " cells", () =>
    grid(bbox, 10, { units: "miles" })
  )
  .add("lowres  -- " + lowres + " cells", () =>
    grid(bbox, 1, { units: "miles" })
  )
  .add("masked  -- " + masked + " cells", () =>
    grid(mask, 10, { units: "miles", mask: mask })
  )
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
