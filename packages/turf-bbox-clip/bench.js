const fs = require("fs");
const path = require("path");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const bbox = require("@turf/bbox").default;
const bboxClip = require("./index").default;

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
 * linestring-single-line x 1,065,073 ops/sec ±1.11% (90 runs sampled)
 * linestring x 56,599 ops/sec ±1.17% (90 runs sampled)
 * multi-linestring x 859,048 ops/sec ±1.01% (91 runs sampled)
 * multi-polygon x 26,991 ops/sec ±0.87% (94 runs sampled)
 * polygon-crossing-hole x 25,277 ops/sec ±0.72% (92 runs sampled)
 * polygon-holes x 27,233 ops/sec ±0.89% (91 runs sampled)
 * polygon x 21,339 ops/sec ±1.19% (89 runs sampled)
 */
const suite = new Benchmark.Suite("turf-bbox-clip");
for (const { name, geojson } of fixtures) {
  suite.add(name, () =>
    bboxClip(geojson.features[0], bbox(geojson.features[1]))
  );
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
