const fs = require("fs");
const path = require("path");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const lineIntersect = require("./index").default;

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
 * 2-vertex-segment x 1,467,485 ops/sec ±1.74% (89 runs sampled)
 * double-intersect x 307,665 ops/sec ±1.70% (91 runs sampled)
 * multi-linestring x 81,337 ops/sec ±0.67% (94 runs sampled)
 * polygons-with-holes x 27,711 ops/sec ±0.70% (92 runs sampled)
 * same-coordinates x 521,277 ops/sec ±0.75% (92 runs sampled)
 */
const suite = new Benchmark.Suite("turf-line-intersect");
for (const { name, geojson } of fixtures) {
  const [line1, line2] = geojson.features;
  suite.add(name, () => lineIntersect(line1, line2));
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
