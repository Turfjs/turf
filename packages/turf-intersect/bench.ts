import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import Benchmark from "benchmark";
import { intersect } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fixtures
const armenia = loadJsonFileSync(
  path.join(__dirname, "test", "in", "armenia.geojson")
);
const simple = loadJsonFileSync(
  path.join(__dirname, "test", "in", "Intersect1.geojson")
);

/**
 * Benchmark Results
 *
 * turf-intersect#simple x 81,192 ops/sec ±1.94% (90 runs sampled)
 * turf-intersect#armenia x 45,824 ops/sec ±2.42% (88 runs sampled)
 */
new Benchmark.Suite("turf-intersect")
  .add("turf-intersect#simple", () => intersect(simple))
  .add("turf-intersect#armenia", () => intersect(armenia))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
