import path from "path";
import { fileURLToPath } from "url";
import Benchmark from "benchmark";
import { point } from "@turf/helpers";
import { lineSlice } from "./index.js";
import { loadJsonFileSync } from "load-json-file";
import { Feature, FeatureCollection, LineString } from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const route1: FeatureCollection = loadJsonFileSync(
  path.join(__dirname, "test", "in", "route1.geojson")
);
const route2: FeatureCollection = loadJsonFileSync(
  path.join(__dirname, "test", "in", "route2.geojson")
);
const line1: FeatureCollection = loadJsonFileSync(
  path.join(__dirname, "test", "in", "line1.geojson")
);

const start1 = point([-97.79617309570313, 22.254624939561698]);
const stop1 = point([-97.72750854492188, 22.057641623615734]);
const start2 = point([-79.0850830078125, 37.60117623656667]);
const stop2 = point([-77.7667236328125, 38.65119833229951]);
const start3 = point([-112.60660171508789, 45.96021963947196]);
const stop3 = point([-111.97265625, 48.84302835299516]);

const suite = new Benchmark.Suite("turf-line-slice");
suite
  .add("turf-line-slice#simple", function () {
    lineSlice(start1, stop1, line1.features[0] as Feature<LineString>);
  })
  .add("turf-line-slice#route1", function () {
    lineSlice(start2, stop2, route1.features[0] as Feature<LineString>);
  })
  .add("turf-line-slice#route2", function () {
    lineSlice(start3, stop3, route2.features[0] as Feature<LineString>);
  })
  .on("cycle", function (event: any) {
    console.log(String(event.target));
  })
  .run();
