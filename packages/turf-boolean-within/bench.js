const Benchmark = require('benchmark');
const {point, lineString, polygon} = require('@turf/helpers');
const within = require('./');

// Fixtures
const pt = point([1, 1]);
const line = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
const poly = polygon([[[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]]);

/**
 * Benchmark Results
 *
 * point - line x 10,269,477 ops/sec ±12.73% (73 runs sampled)
 * point - polygon:
 * point - point x 13,973,421 ops/sec ±8.59% (79 runs sampled)
 * polygon - polygon x 634,618 ops/sec ±2.27% (87 runs sampled)
 * line - line x 22,409 ops/sec ±3.44% (76 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-within');
suite
    .add('point - line', () => within(pt, line))
    .add('point - polygon', () => within(pt, polygon))
    .add('point - point', () => within(pt, pt))
    .add('polygon - polygon', () => within(poly, poly))
    .add('line - line', () => within(line, line))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
