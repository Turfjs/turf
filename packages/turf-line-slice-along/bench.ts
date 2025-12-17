import path from "path";
import { fileURLToPath } from "url";
import Benchmark from "benchmark";
import { lineSliceAlong } from "./index.js";
import { loadJsonFileSync } from "load-json-file";
import { Feature, LineString } from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

var line1: Feature<LineString> = loadJsonFileSync(
  path.join(__dirname, "test", "fixtures", "line1.geojson")
);
var route1: Feature<LineString> = loadJsonFileSync(
  path.join(__dirname, "test", "fixtures", "route1.geojson")
);
var route2: Feature<LineString> = loadJsonFileSync(
  path.join(__dirname, "test", "fixtures", "route2.geojson")
);

const options = { units: "miles" } as const;

var suite = new Benchmark.Suite("turf-line-slice-along");
suite
  .add("turf-line-slice-along#line1 5-15 miles", function () {
    lineSliceAlong(line1, 5, 15, options);
  })
  .add("turf-line-slice-along#line1 50-250 miles", function () {
    lineSliceAlong(line1, 50, 250, options);
  })
  .add("turf-line-slice-along#line1 250-500 miles", function () {
    lineSliceAlong(line1, 250, 500, options);
  })
  .add("turf-line-slice-along#route1 5-15 miles", function () {
    lineSliceAlong(route1, 5, 15, options);
  })
  .add("turf-line-slice-along#route1 50-250 miles", function () {
    lineSliceAlong(route1, 50, 250, options);
  })
  .add("turf-line-slice-along#route1 250-500 miles", function () {
    lineSliceAlong(route1, 250, 500, options);
  })
  .add("turf-line-slice-along#route2 5-15 miles", function () {
    lineSliceAlong(route2, 5, 15, options);
  })
  .add("turf-line-slice-along#route2 15-25 miles", function () {
    lineSliceAlong(route2, 15, 25, options);
  })
  .add("turf-line-slice-along#route2 25-35 miles", function () {
    lineSliceAlong(route2, 25, 35, options);
  })
  .on("cycle", function (event: any) {
    console.log(String(event.target));
  })
  .run();
