const Benchmark = require("benchmark");
const distance = require("./index").default;

var pt1 = [-75.4, 39.4];
var pt2 = [-75.534, 39.123];

var suite = new Benchmark.Suite("turf-distance");
suite
  .add("turf-distance", () => distance(pt1, pt2))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
