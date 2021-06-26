import fs from "fs";
import path from "path";
import load from "load-json-file";
import Benchmark from "benchmark";
import tangents from "./index";

const directory = path.join(__dirname, "test", "in") + path.sep;
let fixtures = fs.readdirSync(directory).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directory + filename),
  };
});

/**
 * Benchmark Results
 * concave x 562,308 ops/sec ±1.87% (86 runs sampled)
 * high x 478,965 ops/sec ±5.76% (70 runs sampled)
 * issue#1032 x 7,041 ops/sec ±2.71% (81 runs sampled)
 * issue#1050 x 388,455 ops/sec ±2.34% (79 runs sampled)
 * issue#785 x 51,146 ops/sec ±3.87% (77 runs sampled)
 * multipolygon x 143,371 ops/sec ±3.17% (80 runs sampled)
 * polygonWithHole x 215,547 ops/sec ±2.13% (83 runs sampled)
 * square x 518,853 ops/sec ±2.68% (81 runs sampled)
 */
const suite = new Benchmark.Suite("turf-polygon-tangents");
for (const { name, geojson } of fixtures) {
  const [poly, pt] = geojson.features;
  suite.add(name, () => tangents(pt, poly));
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
