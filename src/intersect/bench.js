const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const intersect = require('./').default;

// Fixtures
const armenia = load.sync(path.join(__dirname, 'test', 'in', 'armenia.geojson'));
const simple = load.sync(path.join(__dirname, 'test', 'in', 'Intersect1.geojson'));

/**
 * Benchmark Results
 *
 * turf-intersect#simple x 11,529 ops/sec ±15.12% (90 runs sampled)
 * turf-intersect#armenia x 8,011 ops/sec ±1.83% (88 runs sampled)
 */
new Benchmark.Suite('turf-intersect')
    .add('turf-intersect#simple', () => intersect(simple.features[0], simple.features[1]))
    .add('turf-intersect#armenia', () => intersect(armenia.features[0], armenia.features[1]))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
