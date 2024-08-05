import { BBox } from "geojson";
import Benchmark, { Event } from "benchmark";
import { square } from "./index.js";

const bbox: BBox = [0, 0, 5, 10];

const suite = new Benchmark.Suite("turf-square");
suite
  .add("turf-square", function () {
    square(bbox);
  })
  .on("cycle", function (event: Event) {
    console.log(String(event.target));
  })
  .run();
