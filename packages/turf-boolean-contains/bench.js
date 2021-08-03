const path = require("path");
const glob = require("glob");
const Benchmark = require("benchmark");
const load = require("load-json-file");
const bbox = require("@turf/bbox").default;
const contains = require("./index").default;

/**
 * Benchmark Results
 *
 * LineIsNotContainedByLine: 0.697ms
 * LineIsNotContainedByPolygon: 0.123ms
 * LineIsNotContainedByPolygonBoundary: 0.394ms
 * MultiPointsIsNotContainedByLine: 0.140ms
 * MultiPointsOnLineEndsIsNotContainedByLine: 0.013ms
 * MultiPointIsNotContainedByMultiPoint: 0.131ms
 * MultiPointAllOnBoundaryIsNotContainedByPolygon: 0.068ms
 * MultiPointIsNotContainedByPolygon: 0.009ms
 * PointIsNotContainedByLine: 0.006ms
 * PointIsNotContainedByLineBecauseOnEnd: 0.009ms
 * PointOnEndIsContainedByLinestring: 0.007ms
 * PointIsNotContainedBYMultiPoint: 0.171ms
 * PointIsNotContainedByPolygon: 0.022ms
 * PointOnPolygonBoundary: 0.026ms
 * Polygon-Polygon: 0.274ms
 * Polygon-Polygon2: 0.076ms
 * LineIsContainedByLine: 0.013ms
 * LinesExactlySame: 0.016ms
 * LineIsContainedByPolygon: 0.027ms
 * LineIsContainedByPolygonWithNoInternalVertices: 0.029ms
 * MultipointsIsContainedByLine: 0.364ms
 * MultiPointsContainedByMultiPoints: 0.011ms
 * MultiPointsEqual: 0.008ms
 * MultiPointIsContainedByPolygonBoundary: 0.022ms
 * PointIsContainedByLine: 0.617ms
 * PointIsContainedByMultiPoint: 0.010ms
 * PointInsidePolygonBoundary: 0.013ms
 * PolygonExactSameShape: 0.047ms
 * PolygonIsContainedByPolygon: 0.012ms
 * LineIsNotContainedByLine x 1,589,100 ops/sec ±0.33% (96 runs sampled)
 * LineIsNotContainedByPolygon x 2,051,985 ops/sec ±2.50% (86 runs sampled)
 * LineIsNotContainedByPolygonBoundary x 845,089 ops/sec ±0.58% (89 runs sampled)
 * MultiPointsIsNotContainedByLine x 2,149,963 ops/sec ±0.17% (94 runs sampled)
 * MultiPointsOnLineEndsIsNotContainedByLine x 2,037,412 ops/sec ±0.22% (92 runs sampled)
 * MultiPointIsNotContainedByMultiPoint x 7,778,981 ops/sec ±0.25% (95 runs sampled)
 * MultiPointAllOnBoundaryIsNotContainedByPolygon x 2,507,225 ops/sec ±0.72% (94 runs sampled)
 * MultiPointIsNotContainedByPolygon x 2,510,635 ops/sec ±0.63% (97 runs sampled)
 * PointIsNotContainedByLine x 5,661,981 ops/sec ±0.17% (94 runs sampled)
 * PointIsNotContainedByLineBecauseOnEnd x 5,126,586 ops/sec ±0.27% (90 runs sampled)
 * PointOnEndIsContainedByLinestring x 5,263,534 ops/sec ±0.24% (94 runs sampled)
 * PointIsNotContainedBYMultiPoint x 11,119,884 ops/sec ±1.38% (92 runs sampled)
 * PointIsNotContainedByPolygon x 2,490,072 ops/sec ±0.63% (96 runs sampled)
 * PointOnPolygonBoundary x 2,780,452 ops/sec ±0.61% (97 runs sampled)
 * Polygon-Polygon x 1,773,762 ops/sec ±1.75% (90 runs sampled)
 * Polygon-Polygon2 x 759,058 ops/sec ±0.95% (88 runs sampled)
 * LineIsContainedByLine x 1,608,626 ops/sec ±0.61% (93 runs sampled)
 * LinesExactlySame x 1,217,588 ops/sec ±0.52% (96 runs sampled)
 * LineIsContainedByPolygon x 1,109,333 ops/sec ±1.05% (90 runs sampled)
 * LineIsContainedByPolygonWithNoInternalVertices x 1,116,300 ops/sec ±0.94% (90 runs sampled)
 * MultipointsIsContainedByLine x 2,379,783 ops/sec ±0.18% (96 runs sampled)
 * MultiPointsContainedByMultiPoints x 7,758,259 ops/sec ±0.29% (93 runs sampled)
 * MultiPointsEqual x 7,308,718 ops/sec ±1.07% (91 runs sampled)
 * MultiPointIsContainedByPolygonBoundary x 1,316,660 ops/sec ±0.96% (95 runs sampled)
 * PointIsContainedByLine x 6,499,130 ops/sec ±0.17% (93 runs sampled)
 * PointIsContainedByMultiPoint x 11,266,710 ops/sec ±1.84% (91 runs sampled)
 * PointInsidePolygonBoundary x 2,450,588 ops/sec ±0.68% (93 runs sampled)
 * PolygonExactSameShape x 491,320 ops/sec ±0.84% (91 runs sampled)
 * PolygonIsContainedByPolygon x 553,878 ops/sec ±0.82% (93 runs sampled)
 */
const suite = new Benchmark.Suite("turf-boolean-contains");
glob
  .sync(path.join(__dirname, "test", "**", "*.geojson"))
  .forEach((filepath) => {
    const { name } = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    feature1.bbox = bbox(feature1);
    feature2.bbox = bbox(feature2);

    console.time(name);
    contains(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => contains(feature1, feature2));
  });

suite.on("cycle", (e) => console.log(String(e.target))).run();
