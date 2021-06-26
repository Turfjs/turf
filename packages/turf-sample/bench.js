import Benchmark from "benchmark";
import { point, featureCollection } from "@turf/helpers";
import sample from "./index";

var points = featureCollection([
  point(1, 2, { team: "Red Sox" }),
  point(2, 1, { team: "Yankees" }),
  point(3, 1, { team: "Nationals" }),
  point(2, 2, { team: "Yankees" }),
  point(2, 3, { team: "Red Sox" }),
  point(4, 2, { team: "Yankees" }),
]);

new Benchmark.Suite("turf-sample")
  .add("turf-sample", function () {
    sample(points, 4);
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .run();
