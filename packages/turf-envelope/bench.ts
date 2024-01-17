import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import Benchmark from "benchmark";
import { envelope } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fixture = loadJsonFileSync(
  path.join(__dirname, "test", "in", "feature-collection.geojson")
);

var suite = new Benchmark.Suite("turf-envelope");
suite
  .add("turf-envelope", function () {
    envelope(fixture);
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .run();
