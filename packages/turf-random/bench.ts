// I don't think this bench test does anything? There is no entry point into
// the module called random() that takes a string?

import { random } from "./index";
import Benchmark from "benchmark";

var suite = new Benchmark.Suite("turf-random");
suite
  .add("turf-random", function () {
    random("point");
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .run();
