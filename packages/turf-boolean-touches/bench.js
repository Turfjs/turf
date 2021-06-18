const path = require("path");
const glob = require("glob");
const load = require("load-json-file");
const Benchmark = require("benchmark");
const touches = require("./index").default;

/**
 * Benchmark Results
 *
 * LineTouchesEndpoint x 4,804,946 ops/sec ±0.45% (94 runs sampled)
 * LineStringTouchesEnd x 2,238,597 ops/sec ±0.50% (94 runs sampled)
 * LineStringTouchesStart x 2,375,877 ops/sec ±0.61% (95 runs sampled)
 * MultipointTouchesLine x 3,579,763 ops/sec ±0.55% (93 runs sampled)
 * LineTouchesMultiPoly x 821,968 ops/sec ±5.18% (93 runs sampled)
 * LineTouchesSecondMultiPoly x 713,137 ops/sec ±4.34% (86 runs sampled)
 * LineTouchesPolygon x 879,394 ops/sec ±4.20% (71 runs sampled)
 * MultiLineTouchesLine x 2,202,950 ops/sec ±1.65% (89 runs sampled)
 * MultiLineTouchesMultiLine x 855,681 ops/sec ±2.34% (88 runs sampled)
 * MultiLineTouchesMultiPoint x 2,404,596 ops/sec ±1.00% (93 runs sampled)
 * MultiLineTouchesPoint x 12,237,728 ops/sec ±2.96% (88 runs sampled)
 * MultiLineTouchesPolygon x 734,406 ops/sec ±1.63% (93 runs sampled)
 * MultipointTouchesLine x 3,569,551 ops/sec ±1.27% (94 runs sampled)
 * MpTouchesEndMultiLine x 2,726,064 ops/sec ±1.37% (93 runs sampled)
 * MpTouchesSecondMultiLine x 2,687,858 ops/sec ±1.01% (95 runs sampled)
 * multipoint-touches-multipolygon x 940,368 ops/sec ±1.63% (91 runs sampled)
 * MultiPointIsWithinPolygon x 1,732,081 ops/sec ±1.52% (90 runs sampled)
 * MultiLineTouchesMultiPoly x 173,824 ops/sec ±3.04% (85 runs sampled)
 * MultiPolyTouchesMultiPoint x 642,711 ops/sec ±1.86% (89 runs sampled)
 * MultiPolyTouchesMultiPoly x 1,047,930 ops/sec ±3.68% (82 runs sampled)
 * MpTouchesPoint x 8,655,507 ops/sec ±0.88% (93 runs sampled)
 * MultiPolyTouchesPoly x 557,069 ops/sec ±0.57% (94 runs sampled)
 */
const suite = new Benchmark.Suite("turf-boolean-touches");
glob
  .sync(path.join(__dirname, "test/true", "**", "*.geojson"))
  .forEach((filepath) => {
    const { name } = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    touches(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => touches(feature1, feature2));
  });

suite.on("cycle", (e) => console.log(String(e.target))).run();
