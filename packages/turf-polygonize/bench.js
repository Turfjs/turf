const fs = require("fs");
const path = require("path");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const polygonize = require("./index").default;

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
 * complex: 37.120ms
 * cutedge: 0.858ms
 * dangle: 0.289ms
 * two-polygons: 0.784ms
 */
for (const { name, geojson } of fixtures) {
  console.time(name);
  polygonize(geojson);
  console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * complex x 54.67 ops/sec ±9.63% (47 runs sampled)
 * cutedge x 5,413 ops/sec ±2.20% (84 runs sampled)
 * dangle x 9,175 ops/sec ±4.44% (83 runs sampled)
 * two-polygons x 16,323 ops/sec ±1.39% (91 runs sampled)
 */
const suite = new Benchmark.Suite("turf-transform-polygonize");
for (const { name, geojson } of fixtures) {
  suite.add(name, () => polygonize(geojson));
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
