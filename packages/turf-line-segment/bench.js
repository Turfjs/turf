const Benchmark = require('benchmark');
const load = require('load-json-file');
const path = require('path');
const fs = require('fs');
const lineSegment = require('./');

// Fixtures
const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * feature-collection x 375,859 ops/sec ±7.32% (76 runs sampled)
 * linestring x 1,275,685 ops/sec ±1.91% (86 runs sampled)
 * multi-linestring x 643,193 ops/sec ±2.29% (86 runs sampled)
 * multi-polygon x 545,919 ops/sec ±4.77% (77 runs sampled)
 * polygon x 1,066,835 ops/sec ±2.32% (80 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-segment');
fixtures.forEach(({name, geojson}) => suite.add(name, () => lineSegment(geojson)));
suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
