import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import within from './';
import Benchmark from 'benchmark';

/**
 * Benchmark Results
 *
 * LineIsNotWithinLine x 2,878,664 ops/sec ±7.20% (68 runs sampled)
 * LineIsNotWIthinPolygon x 1,818,294 ops/sec ±6.20% (64 runs sampled)
 * LineIsNotWIthinPolygonBoundary x 297,332 ops/sec ±6.31% (77 runs sampled)
 * MultiPointsIsNotWIthinLine x 2,767,186 ops/sec ±6.88% (73 runs sampled)
 * MultiPointsOnLineEndsIsNotWIthinLine x 1,606,670 ops/sec ±7.38% (62 runs sampled)
 * MultiPointIsNotWithinMultiPoint x 7,711,700 ops/sec ±10.08% (52 runs sampled)
 * MultiPointAllOnBoundaryIsNotWithinPolygon x 435,926 ops/sec ±6.12% (49 runs sampled)
 * MultiPointIsNotWithinPolygon x 1,709,920 ops/sec ±7.40% (57 runs sampled)
 * PointIsNotWithinLine x 4,148,704 ops/sec ±5.95% (53 runs sampled)
 * PointIsNotWithinLineBecauseOnEnd x 5,243,476 ops/sec ±7.68% (68 runs sampled)
 * PointOnEndIsWithinLinestring x 5,178,472 ops/sec ±7.04% (68 runs sampled)
 * PointIsNotWithinMultiPoint x 12,366,325 ops/sec ±6.98% (58 runs sampled)
 * PointIsNotWithinPolygon x 1,490,757 ops/sec ±11.13% (66 runs sampled)
 * PointOnPolygonBoundary x 1,758,292 ops/sec ±6.62% (63 runs sampled)
 * Polygon-Polygon x 1,406,871 ops/sec ±8.49% (60 runs sampled)
 * LineIsWithinLine x 2,436,801 ops/sec ±7.33% (59 runs sampled)
 * LinesExactSame x 1,815,051 ops/sec ±10.68% (60 runs sampled)
 * LineIsContainedByPolygon x 330,016 ops/sec ±6.95% (54 runs sampled)
 * LineIsContainedByPolygonWithNoInternalVertices x 465,371 ops/sec ±6.99% (61 runs sampled)
 * MultipointsIsWithinLine x 1,742,280 ops/sec ±7.25% (62 runs sampled)
 * MultiPointsWithinMultiPoints x 11,546,059 ops/sec ±4.41% (87 runs sampled)
 * MultiPointIsWithinPolygon x 409,210 ops/sec ±8.21% (53 runs sampled)
 * PointIsWithinLine x 7,298,078 ops/sec ±10.89% (73 runs sampled)
 * PointIsWithinMultiPoint x 16,495,443 ops/sec ±7.21% (68 runs sampled)
 * PointIsWithinPolygon x 1,820,036 ops/sec ±9.11% (60 runs sampled)
 * PolygonIsWIthinPolygon x 518,524 ops/sec ±5.57% (80 runs sampled)
 * PolygonsExactSameShape x 418,247 ops/sec ±7.43% (80 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-within');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    within(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => within(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
