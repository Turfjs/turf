const Benchmark = require("benchmark");
const helpers = require("@turf/helpers");
const invariant = require("./index");

const pt = helpers.point([-75, 40]);
const line = helpers.lineString([
  [-75, 40],
  [-70, 50],
]);
const poly = helpers.polygon([
  [
    [-75, 40],
    [-80, 50],
    [-70, 50],
    [-75, 40],
  ],
]);
const fc = helpers.points([
  [-75, 40],
  [20, 50],
]);

const suite = new Benchmark.Suite("turf-invariant");

/**
 * Benchmark Results
 *
 * getCoord -- pt x 60,659,161 ops/sec ±1.34% (89 runs sampled)
 * getCoords -- line x 63,252,327 ops/sec ±1.19% (81 runs sampled)
 * getCoords -- poly x 62,053,169 ops/sec ±1.49% (85 runs sampled)
 * collectionOf -- fc x 24,204,462 ops/sec ±2.00% (81 runs sampled)
 * getType -- pt x 59,544,117 ops/sec ±1.14% (87 runs sampled)
 */
suite
  .add("getCoord -- pt", () => invariant.getCoord(pt))
  .add("getCoords -- line", () => invariant.getCoords(line))
  .add("getCoords -- poly", () => invariant.getCoords(poly))
  .add("collectionOf -- fc", () => invariant.collectionOf(fc, "Point", "bench"))
  .add("getType -- pt", () => invariant.getType(pt))
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
