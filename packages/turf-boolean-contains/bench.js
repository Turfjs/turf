const Benchmark = require('benchmark');
const {point, multiPoint, lineString, polygon} = require('@turf/helpers');
const contains = require('./');

// Fixtures
const pt = point([1, 1]);
const mp = multiPoint([[1, 1], [12, 12]]);
const line = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
const poly = polygon([[[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]]);

/**
 * Benchmark Results
 *
 * point - point x 25,229,201 ops/sec ±2.10% (90 runs sampled)
 * point - multipoint:
 * point - line:
 * point - polygon:
 * multipoint - point x 865,610 ops/sec ±1.71% (86 runs sampled)
 * polygon - line x 991,549 ops/sec ±1.71% (90 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-contains');
suite
    .add('point - point', () => contains(pt, pt))
    .add('point - multipoint', () => contains(pt, mp))
    .add('point - line', () => contains(pt, line))
    .add('point - polygon', () => contains(pt, polygon))
    .add('multipoint - point', () => contains(mp, pt))
    .add('polygon - line', () => contains(poly, line))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
