const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const truncate = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});
// fixtures = fixtures.filter(fixture => fixture.name === 'points');

/**
 * Benchmark Results
 *
 * geometry-collection x 276,447 ops/sec ±0.89% (90 runs sampled)
 * linestring-geometry x 171,970 ops/sec ±0.94% (90 runs sampled)
 * point-elevation x 596,808 ops/sec ±1.01% (88 runs sampled)
 * point-geometry x 610,921 ops/sec ±0.98% (92 runs sampled)
 * point x 604,664 ops/sec ±0.79% (89 runs sampled)
 * points x 274,321 ops/sec ±0.71% (94 runs sampled)
 * polygon x 99,680 ops/sec ±1.05% (90 runs sampled)
 * polygons x 48,781 ops/sec ±1.66% (91 runs sampled)
 */
const suite = new Benchmark.Suite('turf-truncate');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => truncate(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
