const Benchmark = require("benchmark");
const rectangleGrid = require("./index").default;

var bbox = [-95, 30, -85, 40];

/**
 * Benchmark Results
 *
 * highres -- 206310 cells x 5.99 ops/sec ±13.42% (19 runs sampled)
 * midres  -- 2006 cells x 3,388 ops/sec ±10.03% (85 runs sampled)
 * lowres  -- 15 cells x 466,370 ops/sec ±1.14% (88 runs sampled)
 */

const lowres = () => rectangleGrid(bbox, 100, 200, { units: "miles" });
const midres = () => rectangleGrid(bbox, 10, 20, { units: "miles" });
const highres = () => rectangleGrid(bbox, 1, 2, { units: "miles" });
var suite = new Benchmark.Suite("turf-rectangle-grid");
suite
  .add("highres -- " + highres().features.length + " cells", highres)
  .add("midres  -- " + midres().features.length + " cells", midres)
  .add("lowres  -- " + lowres().features.length + " cells", lowres)
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
