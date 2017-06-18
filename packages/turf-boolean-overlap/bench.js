const Benchmark = require('benchmark');
const {point, lineString, polygon} = require('@turf/helpers');
const disjoint = require('./');

// Fixtures
const pt = point([1, 1]);
const line = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
const poly = polygon([[[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]]);

/**
 * Benchmark Results
 *
 * point - line:
 * point - polygon:
 * point - point:
 * polygon - polygon x 31,308 ops/sec ±4.59% (66 runs sampled)
 * polygon - line:
 * line - line x 19,328,831 ops/sec ±1.19% (86 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-disjoint');
suite
    .add('point - line', () => disjoint(pt, line))
    .add('point - polygon', () => disjoint(pt, polygon))
    .add('point - point', () => disjoint(pt, pt))
    .add('polygon - polygon', () => disjoint(poly, poly))
    .add('polygon - line', () => disjoint(poly, line))
    .add('line - line', () => disjoint(line, line))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
