import path from "path";
import { glob } from "glob";
import Benchmark from "benchmark";
import { loadJsonFileSync } from "load-json-file";
import { bbox } from "@turf/bbox";
import { booleanValid as isValid } from "./index";

/**
 * Benchmark Results
 *
 */
const suite = new Benchmark.Suite("turf-boolean-is-valid");
glob
  .sync(path.join(__dirname, "test", "**", "*.geojson"))
  .forEach((filepath) => {
    const { name } = path.parse(filepath);
    const geojson = loadJsonFileSync(filepath);
    const [feature1] = geojson.features;

    feature1.bbox = bbox(feature1);

    console.time(name);
    isValid(feature1);
    console.timeEnd(name);
    suite.add(name, () => isValid(feature1));
  });

suite.on("cycle", (e) => console.log(String(e.target))).run();
