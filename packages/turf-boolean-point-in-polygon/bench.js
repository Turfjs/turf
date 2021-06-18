const fs = require("fs");
const Benchmark = require("benchmark");
const { point, polygon } = require("@turf/helpers");
const booleanPointInPolygon = require("./index").default;

var poly = polygon([
  [
    [0, 0],
    [0, 100],
    [100, 100],
    [100, 0],
    [0, 0],
  ],
]);
var ptIn = point([50, 50]);

var ptInPoly = point([-86.7222, 36.2025]);
var ptOutsidePoly = point([-110, 40]);
var multiPolyHole = JSON.parse(
  fs.readFileSync(__dirname + "/test/in/multipoly-with-hole.geojson")
);

/**
 * Benchmark Results
 *
 * simple x 3,219,331 ops/sec ±1.14% (91 runs sampled)
 * multiPolyHole - inside x 1,171,486 ops/sec ±1.10% (90 runs sampled)
 * multiPolyHole - outside x 7,697,033 ops/sec ±0.89% (89 runs sampled)
 */
var suite = new Benchmark.Suite("turf-boolean-point-in-polygon");
suite
  .add("simple", () => booleanPointInPolygon(ptIn, poly))
  .add("multiPolyHole - inside", () =>
    booleanPointInPolygon(ptInPoly, multiPolyHole)
  )
  .add("multiPolyHole - outside", () =>
    booleanPointInPolygon(ptOutsidePoly, multiPolyHole)
  )
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
