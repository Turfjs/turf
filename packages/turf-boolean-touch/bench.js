const Benchmark = require('benchmark');
const {point, lineString, polygon} = require('@turf/helpers');
const touch = require('./');

// Fixtures
const pt = point([1, 1]);
const line = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
const poly = polygon([[[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]]);

/**
 * Benchmark Results
 *
 * point - line x 787,087 ops/sec ±4.45% (81 runs sampled)
 * point - polygon:
 * point - point x 21,469,879 ops/sec ±7.21% (84 runs sampled)
 * polygon - polygon x 11,608,532 ops/sec ±1.03% (88 runs sampled)
 * line - line x 14,834,036 ops/sec ±1.15% (85 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-touch');
suite
    .add('point - line', () => touch(pt, line))
    .add('point - polygon', () => touch(pt, polygon))
    .add('point - point', () => touch(pt, pt))
    .add('polygon - polygon', () => touch(poly, poly))
    .add('line - line', () => touch(line, line))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
