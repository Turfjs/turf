import Benchmark from "benchmark";
import grid from "./dist/js/index.js";

var bbox1 = [
  -96.6357421875,
  31.12819929911196,
  -84.9462890625,
  40.58058466412764,
];

var highres = grid(bbox1, 100, "miles").features.length;
var midres = grid(bbox1, 10, "miles").features.length;
var lowres = grid(bbox1, 1, "miles").features.length;
var suite = new Benchmark.Suite("turf-triangle-grid");
suite
  .add("turf-triangle-grid -- " + highres + " cells", function () {
    grid(bbox1, 100, "miles");
  })
  .add("turf-triangle-grid -- " + midres + " cells", function () {
    grid(bbox1, 10, "miles");
  })
  .add("turf-triangle-grid -- " + lowres + " cells", function () {
    grid(bbox1, 1, "miles");
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {})
  .run();
