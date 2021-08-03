import Benchmark from "benchmark";
import square from "./index";

var bbox = [0, 0, 5, 10];

var suite = new Benchmark.Suite("turf-square");
suite
  .add("turf-square", function () {
    square(bbox);
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .run();
