const Benchmark = require("benchmark");
const destination = require("./index").default;

var pt1 = [-75.0, 39.0];
var dist = 100;
var bear = 180;

new Benchmark.Suite("turf-destination")
  .add("turf-destination", () => destination(pt1, dist, bear))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
