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
 * point - line x 14,283,680 ops/sec ±3.28% (85 runs sampled)
 * point - polygon:
 * point - point x 16,109,117 ops/sec ±1.89% (82 runs sampled)
 * polygon - polygon x 11,758,387 ops/sec ±1.47% (88 runs sampled)
 * polygon - line x 13,295,613 ops/sec ±1.00% (87 runs sampled)
 * line - line x 15,459,060 ops/sec ±1.03% (89 runs sampled)
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
