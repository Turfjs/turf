const Benchmark = require("benchmark");
const grid = require("./index").default;

// prettier-ignore
var bbox = [
  -96.6357421875,
  31.12819929911196,
  -84.9462890625,
  40.58058466412764,
];

/**
 * Benchmark Results
 *
 * turf-hex-grid -- 10 cells x 67,086 ops/sec ±12.27% (80 runs sampled)
 * turf-hex-grid -- 1570 cells x 571 ops/sec ±1.52% (83 runs sampled)
 * turf-hex-grid -- 163778 cells x 1.13 ops/sec ±11.65% (7 runs sampled)
 */

var lowres = grid(bbox, 100, { units: "miles" }).features.length;
var midres = grid(bbox, 10, { units: "miles" }).features.length;
var highres = grid(bbox, 1, { units: "miles" }).features.length;

var suite = new Benchmark.Suite("turf-hex-grid");
suite
  .add("turf-hex-grid -- " + lowres + " cells", function () {
    grid(bbox, 100, { units: "miles" });
  })
  .add("turf-hex-grid -- " + midres + " cells", function () {
    grid(bbox, 10, { units: "miles" });
  })
  .add("turf-hex-grid -- " + highres + " cells", function () {
    grid(bbox, 1, { units: "miles" });
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .run();
