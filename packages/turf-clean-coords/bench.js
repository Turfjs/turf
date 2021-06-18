const path = require("path");
const glob = require("glob");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const cleanCoords = require("./index").default;

/**
 * Benchmark Results
 *
 * geometry: 0.675ms
 * multiline: 0.044ms
 * multipoint: 0.291ms
 * multipolygon: 0.062ms
 * point: 0.010ms
 * polygon-with-hole: 0.017ms
 * polygon: 0.010ms
 * simple-line: 0.008ms
 * triangle: 0.020ms
 *
 * // mutate=false (using geometry/feature)
 * geometry x 1,524,640 ops/sec ±4.60% (74 runs sampled)
 * multiline x 1,511,608 ops/sec ±8.79% (72 runs sampled)
 * multipoint x 382,429 ops/sec ±3.56% (84 runs sampled)
 * multipolygon x 808,277 ops/sec ±2.84% (82 runs sampled)
 * point x 14,675,464 ops/sec ±4.42% (80 runs sampled)
 * polygon-with-hole x 1,493,507 ops/sec ±5.53% (72 runs sampled)
 * polygon x 2,386,278 ops/sec ±1.27% (86 runs sampled)
 * simple-line x 4,195,499 ops/sec ±2.88% (86 runs sampled)
 * triangle x 2,254,753 ops/sec ±1.10% (88 runs sampled)
 *
 * // mutate=false (using @turf/clone)
 * geometry x 202,410 ops/sec ±1.43% (88 runs sampled)
 * multiline x 235,421 ops/sec ±3.48% (86 runs sampled)
 * multipoint x 280,757 ops/sec ±1.59% (87 runs sampled)
 * multipolygon x 127,353 ops/sec ±1.35% (88 runs sampled)
 * point x 18,233,987 ops/sec ±1.34% (86 runs sampled)
 * polygon-with-hole x 199,203 ops/sec ±2.61% (84 runs sampled)
 * polygon x 355,616 ops/sec ±1.58% (86 runs sampled)
 * simple-line x 515,430 ops/sec ±2.40% (83 runs sampled)
 * triangle x 286,315 ops/sec ±1.64% (86 runs sampled)
 *
 * // mutate=false (using JSON.parse + JSON.stringify)
 * geometry x 93,681 ops/sec ±7.66% (75 runs sampled)
 * multiline x 112,836 ops/sec ±4.60% (82 runs sampled)
 * multipoint x 113,937 ops/sec ±1.09% (90 runs sampled)
 * multipolygon x 71,131 ops/sec ±1.32% (90 runs sampled)
 * point x 18,181,612 ops/sec ±1.36% (91 runs sampled)
 * polygon-with-hole x 100,011 ops/sec ±1.14% (85 runs sampled)
 * polygon x 154,331 ops/sec ±1.31% (89 runs sampled)
 * simple-line x 193,304 ops/sec ±1.33% (90 runs sampled)
 * triangle x 130,921 ops/sec ±3.37% (87 runs sampled)
 *
 * // mutate=true
 * geometry x 2,016,365 ops/sec ±1.83% (85 runs sampled)
 * multiline x 2,266,787 ops/sec ±3.69% (79 runs sampled)
 * multipoint x 411,246 ops/sec ±0.81% (89 runs sampled)
 * multipolygon x 1,011,846 ops/sec ±1.34% (85 runs sampled)
 * point x 17,635,961 ops/sec ±1.47% (89 runs sampled)
 * polygon-with-hole x 2,110,166 ops/sec ±1.59% (89 runs sampled)
 * polygon x 2,887,298 ops/sec ±1.75% (86 runs sampled)
 * simple-line x 7,109,682 ops/sec ±1.52% (87 runs sampled)
 * triangle x 3,116,940 ops/sec ±0.71% (87 runs sampled)
 */
const suite = new Benchmark.Suite("turf-clean-coords");
glob
  .sync(path.join(__dirname, "test", "in", "*.geojson"))
  .forEach((filepath) => {
    const { name } = path.parse(filepath);
    const geojson = load.sync(filepath);
    console.time(name);
    cleanCoords(geojson);
    console.timeEnd(name);
    suite.add(name, () => cleanCoords(geojson, true));
  });

suite.on("cycle", (e) => console.log(String(e.target))).run();
