const Benchmark = require("benchmark");
const squareGrid = require("./index").default;

var bbox = [-95, 30, -85, 40];

/**
 * Benchmark Results
 *
 * highres -- 30 cells x 136,441 ops/sec ±0.68% (93 runs sampled)
 * midres  -- 4071 cells x 981 ops/sec ±2.43% (77 runs sampled)
 * lowres  -- 412620 cells x 1.18 ops/sec ±9.27% (7 runs sampled)
 */

var highres = squareGrid(bbox, 100, { units: "miles" }).features.length;
var midres = squareGrid(bbox, 10, { units: "miles" }).features.length;
var lowres = squareGrid(bbox, 1, { units: "miles" }).features.length;
var suite = new Benchmark.Suite("turf-square-grid");
suite
  .add("highres -- " + highres + " cells", () =>
    squareGrid(bbox, 100, { units: "miles" })
  )
  .add("midres  -- " + midres + " cells", () =>
    squareGrid(bbox, 10, { units: "miles" })
  )
  .add("lowres  -- " + lowres + " cells", () =>
    squareGrid(bbox, 1, { units: "miles" })
  )
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
