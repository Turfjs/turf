const Benchmark = require("benchmark");
const moranIndex = require("./dist/js/index.js").default;
const path = require("path");
const load = require("load-json-file");

/**
 * Benchmark Results
 *
 * point: 3.434ms
 * point x 4,672 ops/sec ±1.38% (94 runs sampled)
 */
const suite = new Benchmark.Suite("turf-moran-index");

const pointPath = path.join(__dirname, "test", "in", "point.json");
const pointJson = load.sync(pointPath);

const { name } = path.parse(pointPath);

console.time(name);
moranIndex(pointJson, {
  inputField: "CRIME",
});
console.timeEnd(name);
suite.add(name, () =>
  moranIndex(pointJson, {
    inputField: "CRIME",
  })
);

suite.on("cycle", (e) => console.log(String(e.target))).run();
