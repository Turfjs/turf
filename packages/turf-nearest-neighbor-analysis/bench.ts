import Benchmark from "benchmark";
import { glob } from "glob";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { nearestNeighborAnalysis } from "./index";

/**
 * Benchmark Results
 *
 * brazil-states-bbox: 5.565ms
 * brazil-states-brazil-itself-as-study-area: 4.516ms
 * random-large-study-area: 13.540ms
 * random-outlier: 6.838ms
 * random: 6.862ms
 * squares: 3.393ms
 */
const suite = new Benchmark.Suite("turf-nearest-neighbor");
glob.sync(path.join(__dirname, "test", "in", "*.json")).forEach((filepath) => {
  const { name } = path.parse(filepath);
  const geojson = loadJsonFileSync(filepath);
  const options = geojson.options;
  console.time(name);
  nearestNeighborAnalysis(geojson, options);
  console.timeEnd(name);
  suite.add(name, () => nearestNeighborAnalysis(geojson, options));
});

suite.on("cycle", (e) => console.log(String(e.target))).run();
