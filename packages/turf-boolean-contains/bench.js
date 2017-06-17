const path = require('path');
const glob = require('glob');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const bbox = require('@turf/bbox');
const contains = require('./');

/**
 * Benchmark Results
 *
 * LineIsNotContainedByLine x 4,133,850 ops/sec ±1.62% (92 runs sampled)
 * LineIsNotContainedByPolygon x 1,416,083 ops/sec ±2.47% (87 runs sampled)
 * LineIsNotContainedByPolygonBoundary x 1,419,828 ops/sec ±1.85% (88 runs sampled)
 * MultiPointIsNotContainedByMultiPoint x 6,705,712 ops/sec ±4.32% (76 runs sampled)
 * MultiPointIsNotContainedByPolygon x 2,043,151 ops/sec ±3.21% (82 runs sampled)
 * MultiPointsIsNotContainedByLine x 5,210,528 ops/sec ±3.21% (74 runs sampled)
 * PointIsNotContainedByLine x 7,324,482 ops/sec ±4.22% (84 runs sampled)
 * PointIsNotContainedByLineBecauseOnEnd x 6,024,271 ops/sec ±5.04% (78 runs sampled)
 * PointIsNotContainedBYMultiPoint x 10,063,229 ops/sec ±3.50% (80 runs sampled)
 * PointIsNotContainedByPolygon x 2,204,858 ops/sec ±3.03% (80 runs sampled)
 * PointOnPolygonBoundary x 2,387,408 ops/sec ±2.47% (83 runs sampled)
 * PolygonIsNotContainedByPolygon x 1,999,776 ops/sec ±3.20% (84 runs sampled)
 * LineIsContainedByLine x 3,434,699 ops/sec ±3.43% (82 runs sampled)
 * LineIsContainedByPolygon x 853,234 ops/sec ±2.43% (79 runs sampled)
 * MultiPointIsContainedByPolygonBoundary x 1,197,014 ops/sec ±1.89% (85 runs sampled)
 * MultiPointsContainedByMultiPoints x 6,601,619 ops/sec ±2.44% (80 runs sampled)
 * MultipointsIsContainedByLine x 5,843,279 ops/sec ±2.37% (82 runs sampled)
 * PointInsidePolygonBoundary x 2,110,993 ops/sec ±3.84% (79 runs sampled)
 * PointIsContainedByLine x 7,436,720 ops/sec ±2.74% (80 runs sampled)
 * PointIsContainedByMultiPoint x 10,256,333 ops/sec ±4.22% (75 runs sampled)
 * PolygonIsContainedByPolygon x 757,885 ops/sec ±2.61% (82 runs sampled)
 * PolygonsExactSameShape x 758,328 ops/sec ±2.27% (86 runs sampled)
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
