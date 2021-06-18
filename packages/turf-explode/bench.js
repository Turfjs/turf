import Benchmark from "benchmark";
import { polygon } from "@turf/helpers";
import explode from "./index";

var poly = polygon([
  [
    [0, 0],
    [0, 10],
    [10, 10],
    [10, 0],
    [0, 0],
  ],
]);

var suite = new Benchmark.Suite("turf-explode");
suite
  .add("turf-explode", () => {
    explode(poly);
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run();
