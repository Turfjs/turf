const path = require('path');
const glob = require('glob');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const bbox = require('@turf/bbox');
const contains = require('./');

/**
 * Benchmark Results
 *
 * LineIsNotContainedByLine x 4,398,295 ops/sec ±1.43% (84 runs sampled)
 * LineIsNotContainedByPolygon x 1,916,541 ops/sec ±3.03% (84 runs sampled)
 * LineIsNotContainedByPolygonBoundary x 721,394 ops/sec ±3.84% (77 runs sampled)
 * MultiPointAllOnBoundaryIsNotContainedByPolygon x 2,190,982 ops/sec ±2.56% (89 runs sampled)
 * MultiPointIsNotContainedByMultiPoint x 7,368,141 ops/sec ±1.02% (90 runs sampled)
 * MultiPointIsNotContainedByPolygon x 2,150,014 ops/sec ±0.92% (88 runs sampled)
 * MultiPointsIsNotContainedByLine x 4,678,701 ops/sec ±0.88% (84 runs sampled)
 * MultiPointsOnLineEndsIsNotContainedByLine x 3,713,593 ops/sec ±5.79% (86 runs sampled)
 * PointIsNotContainedByLine x 6,149,162 ops/sec ±5.08% (82 runs sampled)
 * PointIsNotContainedByLineBecauseOnEnd x 6,491,086 ops/sec ±0.79% (89 runs sampled)
 * PointIsNotContainedBYMultiPoint x 10,046,634 ops/sec ±0.55% (92 runs sampled)
 * PointIsNotContainedByPolygon x 2,310,881 ops/sec ±1.45% (88 runs sampled)
 * PointOnEndIsContainedByLinestring x 6,252,890 ops/sec ±2.74% (79 runs sampled)
 * PointOnPolygonBoundary x 2,607,654 ops/sec ±0.88% (90 runs sampled)
 * PolygonIsNotContainedByPolygon x 1,706,009 ops/sec ±2.14% (87 runs sampled)
 * LineIsContainedByLine x 4,310,811 ops/sec ±1.42% (89 runs sampled)
 * LineIsContainedByPolygon x 1,101,408 ops/sec ±3.09% (89 runs sampled)
 * LineIsContainedByPolygonWithNoInternalVertices x 1,153,415 ops/sec ±1.00% (88 runs sampled)
 * LinesExactSame x 3,881,843 ops/sec ±3.83% (91 runs sampled)
 * MultiPointIsContainedByPolygonBoundary x 1,262,263 ops/sec ±2.75% (89 runs sampled)
 * MultiPointsContainedByMultiPoints x 7,074,094 ops/sec ±3.32% (92 runs sampled)
 * MultipointsIsContainedByLine x 4,909,852 ops/sec ±2.85% (92 runs sampled)
 * PointInsidePolygonBoundary x 2,323,817 ops/sec ±3.11% (88 runs sampled)
 * PointIsContainedByLine x 7,894,080 ops/sec ±3.41% (89 runs sampled)
 * PointIsContainedByMultiPoint x 11,832,775 ops/sec ±2.13% (89 runs sampled)
 * PolygonIsContainedByPolygon x 1,907,608 ops/sec ±5.67% (87 runs sampled)
 * PolygonsExactSameShape x 1,578,745 ops/sec ±7.73% (76 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-contains');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    feature1.bbox = bbox(feature1);
    feature2.bbox = bbox(feature2);
    suite.add(name, () => contains(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
