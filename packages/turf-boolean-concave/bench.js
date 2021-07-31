const path = require("path");
const glob = require("glob");
const Benchmark = require("benchmark");
const load = require("load-json-file");
const concave = require("./index").default;

/**
 * Benchmark Results
 * 3vertices x 9,177,672 ops/sec ±0.67% (89 runs sampled)
 * diamond x 2,989,753 ops/sec ±0.14% (92 runs sampled)
 * square x 3,322,185 ops/sec ±0.20% (91 runs sampled)
 * polygon x 3,422,036 ops/sec ±0.42% (91 runs sampled)
 * polygon2 x 2,412,660 ops/sec ±1.66% (85 runs sampled)
 */
const suite = new Benchmark.Suite("turf-boolean-is-concave");
glob
  .sync(path.join(__dirname, "test", "**", "*.geojson"))
  .forEach((filepath) => {
    const { name } = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature] = geojson.features;
    suite.add(name, () => concave(feature));
  });

suite.on("cycle", (e) => console.log(String(e.target))).run();
