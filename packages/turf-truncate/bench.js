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
// fixtures = fixtures.filter(fixture => fixture.name === 'polygons');

/**
 * Benchmark Results
 *
 * geometry-collection x 98,749 ops/sec ±1.07% (89 runs sampled)
 * linestring-geometry x 90,919 ops/sec ±1.84% (91 runs sampled)
 * point-elevation x 139,019 ops/sec ±0.98% (91 runs sampled)
 * point-geometry x 190,760 ops/sec ±3.51% (88 runs sampled)
 * point x 131,023 ops/sec ±2.85% (89 runs sampled)
 * points x 78,493 ops/sec ±0.98% (87 runs sampled)
 * polygon x 48,417 ops/sec ±2.66% (86 runs sampled)
 * polygons x 24,369 ops/sec ±1.99% (86 runs sampled)
 */
const suite = new Benchmark.Suite('turf-truncate');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => truncate(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
