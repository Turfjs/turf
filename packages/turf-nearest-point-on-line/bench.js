const fs = require("fs");
const path = require("path");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const nearestPointOnLine = require("./index").default;

const directory = path.join(__dirname, "test", "in") + path.sep;
const fixtures = fs.readdirSync(directory).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directory + filename),
  };
});

/**
 * Benchmark Results
 *
 * ==after (@turf/line-intersect)==
 * line1 x 234,231 ops/sec ±1.78% (88 runs sampled)
 * route1 x 161 ops/sec ±1.53% (80 runs sampled)
 * route2 x 184 ops/sec ±1.96% (80 runs sampled)
 *
 * ==before (original)==
 * line1 x 272,785 ops/sec ±1.29% (87 runs sampled)
 * route1 x 195 ops/sec ±2.23% (80 runs sampled)
 * route2 x 218 ops/sec ±2.42% (78 runs sampled)
 */
const suite = new Benchmark.Suite("turf-nearest-point-on-line");
for (const { name, geojson } of fixtures) {
  const [line, point] = geojson.features;
  suite.add(name, () => nearestPointOnLine(line, point));
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
