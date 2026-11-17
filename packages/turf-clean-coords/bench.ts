import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import { loadJsonFileSync } from "load-json-file";
import Benchmark from "benchmark";
import { GeoJSON } from "geojson";
import { cleanCoords } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Benchmark Results
 *
 * Note - the original author benchmarked alternative methods of avoiding
 * mutation and concluded that @turf/clone and JSON.parse were ~10x slower than
 * direct use of geometry/features.
 *
 * // mutate=false
 * triplicate-issue1255 x 3,062,616 ops/sec ±0.39% (94 runs sampled)
 * triangle x 2,082,533 ops/sec ±0.34% (96 runs sampled)
 * simple-line x 3,779,713 ops/sec ±0.40% (95 runs sampled)
 * segment x 6,582,228 ops/sec ±1.30% (82 runs sampled)
 * polygon x 2,585,401 ops/sec ±0.25% (99 runs sampled)
 * polygon-with-hole x 1,518,417 ops/sec ±0.34% (93 runs sampled)
 * point x 26,543,371 ops/sec ±0.88% (89 runs sampled)
 * multipolygon x 974,694 ops/sec ±1.27% (97 runs sampled)
 * multipoint x 2,537,537 ops/sec ±0.56% (95 runs sampled)
 * multiline x 1,974,913 ops/sec ±0.39% (93 runs sampled)
 * line-3-coords x 6,701,852 ops/sec ±0.54% (97 runs sampled)
 * geometry x 1,582,544 ops/sec ±1.38% (93 runs sampled)
 * geometry-collection x 1,015,123 ops/sec ±0.30% (98 runs sampled)
 * feature-collection x 945,614 ops/sec ±0.23% (95 runs sampled)
 * closed-linestring x 8,822,010 ops/sec ±0.89% (93 runs sampled)
 * clean-segment x 18,363,540 ops/sec ±0.68% (94 runs sampled)
 *
 *
 * // mutate=true
 * triplicate-issue1255 x 5,643,789 ops/sec ±0.45% (95 runs sampled)
 * triangle x 6,429,094 ops/sec ±0.47% (95 runs sampled)
 * simple-line x 22,923,304 ops/sec ±0.84% (90 runs sampled)
 * segment x 22,916,879 ops/sec ±0.86% (92 runs sampled)
 * polygon x 4,867,685 ops/sec ±0.55% (92 runs sampled)
 * polygon-with-hole x 2,746,040 ops/sec ±0.69% (95 runs sampled)
 * point x 32,975,988 ops/sec ±1.20% (92 runs sampled)
 * multipolygon x 2,022,668 ops/sec ±0.47% (96 runs sampled)
 * multipoint x 2,549,962 ops/sec ±1.48% (92 runs sampled)
 * multiline x 19,285,512 ops/sec ±1.20% (91 runs sampled)
 * line-3-coords x 22,508,235 ops/sec ±1.52% (90 runs sampled)
 * geometry x 2,925,115 ops/sec ±0.35% (96 runs sampled)
 * geometry-collection x 2,052,061 ops/sec ±0.60% (96 runs sampled)
 * feature-collection x 1,914,939 ops/sec ±0.33% (97 runs sampled)
 * closed-linestring x 10,339,559 ops/sec ±0.56% (93 runs sampled)
 * clean-segment x 22,354,825 ops/sec ±0.84% (95 runs sampled)
 */
const suite = new Benchmark.Suite("turf-clean-coords");
glob
  .sync(path.join(__dirname, "test", "in", "*.geojson"))
  .forEach((filepath) => {
    const { name } = path.parse(filepath);
    const geojson = loadJsonFileSync(filepath) as GeoJSON;
    suite.add(name, () => cleanCoords(geojson));
    //suite.add(name, () => cleanCoords(geojson, { mutate: true }));
  });

suite.on("cycle", (e: any) => console.log(String(e.target))).run();
