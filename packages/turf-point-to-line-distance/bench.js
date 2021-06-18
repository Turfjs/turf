const fs = require("fs");
const path = require("path");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const pointToLineDistance = require("./index").default;

const directory = path.join(__dirname, "test", "in") + path.sep;
const fixtures = fs.readdirSync(directory).map((filename) => {
  return {
    name: path.parse(filename).name,
    geojson: load.sync(directory + filename),
  };
});

/**
 * Single Process Benchmark
 *
 * city-line1: 2.922ms
 * city-line2: 0.113ms
 * city-segment-inside1: 0.042ms
 * city-segment-inside2: 0.034ms
 * city-segment-inside3: 0.032ms
 * city-segment-obtuse1: 0.030ms
 * city-segment-obtuse2: 0.029ms
 * city-segment-projected1: 0.030ms
 * city-segment-projected2: 0.029ms
 * issue-1156: 0.046ms
 * line-fiji: 0.107ms
 * line-resolute-bay: 0.059ms
 * line1: 0.079ms
 * line2: 0.115ms
 * segment-fiji: 0.050ms
 * segment1: 0.069ms
 * segment1a: 0.037ms
 * segment2: 0.071ms
 * segment3: 0.043ms
 * segment4: 0.035ms
 */
for (const { name, geojson } of fixtures) {
  const [point, line] = geojson.features;
  let { units } = geojson.properties || {};
  if (!units) units = "kilometers";
  console.time(name);
  pointToLineDistance(point, line, { units: units });
  console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * city-line1 x 241,682 ops/sec ±1.01% (84 runs sampled)
 * city-line2 x 343,906 ops/sec ±1.01% (82 runs sampled)
 * city-segment-inside1 x 605,854 ops/sec ±1.59% (82 runs sampled)
 * city-segment-inside2 x 662,380 ops/sec ±1.45% (84 runs sampled)
 * city-segment-inside3 x 635,562 ops/sec ±2.29% (78 runs sampled)
 * city-segment-obtuse1 x 749,977 ops/sec ±1.27% (86 runs sampled)
 * city-segment-obtuse2 x 744,285 ops/sec ±1.54% (88 runs sampled)
 * city-segment-projected1 x 765,848 ops/sec ±0.64% (87 runs sampled)
 * city-segment-projected2 x 737,822 ops/sec ±1.65% (85 runs sampled)
 * issue-1156 x 443,056 ops/sec ±1.44% (83 runs sampled)
 * line-fiji x 126,628 ops/sec ±1.34% (87 runs sampled)
 * line-resolute-bay x 537,213 ops/sec ±1.44% (90 runs sampled)
 * line1 x 182,059 ops/sec ±0.83% (85 runs sampled)
 * line2 x 404,766 ops/sec ±2.15% (87 runs sampled)
 * segment-fiji x 634,658 ops/sec ±1.58% (85 runs sampled)
 * segment1 x 582,624 ops/sec ±2.53% (80 runs sampled)
 * segment1a x 600,014 ops/sec ±1.08% (82 runs sampled)
 * segment2 x 595,434 ops/sec ±2.17% (81 runs sampled)
 * segment3 x 692,171 ops/sec ±1.16% (82 runs sampled)
 * segment4 x 681,063 ops/sec ±0.95% (86 runs sampled)
 */
const suite = new Benchmark.Suite("turf-point-to-line-distance");
for (const { name, geojson } of fixtures) {
  const [point, line] = geojson.features;
  let { units } = geojson.properties || {};
  if (!units) units = "kilometers";
  suite.add(name, () => pointToLineDistance(point, line, { units: units }));
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
