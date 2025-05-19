import Benchmark, { Event } from "benchmark";
import { randomPolygon } from "./index.js";

let totalTime = 0.0;
const suite = new Benchmark.Suite("turf-random");

suite
  .add("turf-random", () => randomPolygon(1, { num_vertices: 100000 }), {
    onComplete: (e: Event) =>
      (totalTime = totalTime += e.target.times?.elapsed),
  })
  .on("cycle", (e: Event) => console.log(String(e.target)))
  .on("complete", () =>
    console.log(`completed in ${totalTime.toFixed(2)} seconds`)
  )
  .run();
