const fs = require("fs");
const path = require("path");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const difference = require("./index").default;

const directory = path.join(__dirname, "test", "in") + path.sep;
let fixtures = fs.readdirSync(directory).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directory + filename),
  };
});
// fixtures = fixtures.filter(({name}) => name === 'issue-#721');

/**
 * Benchmark Results
 *
 * ==using martinez==
 * clip-polygons x 38,724 ops/sec ±11.98% (65 runs sampled)
 * completely-overlapped x 70,644 ops/sec ±8.29% (67 runs sampled)
 * create-hole x 62,128 ops/sec ±7.45% (75 runs sampled)
 * issue-#721-inverse x 354,473 ops/sec ±2.46% (81 runs sampled)
 * issue-#721 x 339,053 ops/sec ±3.24% (78 runs sampled)
 * multi-polygon-input x 17,728 ops/sec ±10.01% (64 runs sampled)
 * multi-polygon-target x 14,077 ops/sec ±6.52% (75 runs sampled)
 * split-polygon x 29,258 ops/sec ±8.99% (69 runs sampled)
 */
const suite = new Benchmark.Suite("turf-difference");
for (const { name, geojson } of fixtures) {
  suite.add(name, () => difference(geojson));
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
