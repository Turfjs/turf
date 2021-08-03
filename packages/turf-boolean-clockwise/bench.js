const path = require("path");
const glob = require("glob");
const Benchmark = require("benchmark");
const load = require("load-json-file");
const isClockwise = require("./index").default;

/**
 * Benchmark Results
 *
 * counter-clockwise-line x 7,272,353 ops/sec ±11.64% (58 runs sampled)
 * clockwise-line x 10,724,102 ops/sec ±2.19% (76 runs sampled)
 */
const suite = new Benchmark.Suite("turf-boolean-clockwise");
glob
  .sync(path.join(__dirname, "test", "**", "*.geojson"))
  .forEach((filepath) => {
    const { name } = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature] = geojson.features;
    suite.add(name, () => isClockwise(feature));
  });

suite.on("cycle", (e) => console.log(String(e.target))).run();
