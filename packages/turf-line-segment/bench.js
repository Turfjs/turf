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
 * feature-collection x 440,309 ops/sec ±0.69% (89 runs sampled)
 * linestring x 1,353,662 ops/sec ±1.64% (84 runs sampled)
 * multi-linestring x 588,394 ops/sec ±6.48% (78 runs sampled)
 * polygon-with-holes x 619,014 ops/sec ±1.38% (87 runs sampled)
 * polygon x 1,278,418 ops/sec ±1.47% (86 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-segment');
fixtures.forEach(({name, geojson}) => suite.add(name, () => lineSegment(geojson)));
suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
