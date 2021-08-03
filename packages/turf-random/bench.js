const random = require("./index");
const Benchmark = require("benchmark");

var suite = new Benchmark.Suite("turf-random");
suite
  .add("turf-random", function () {
    random("point");
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .run();
