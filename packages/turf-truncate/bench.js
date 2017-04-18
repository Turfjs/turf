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
 * geometry-collection x 738,378 ops/sec ±1.53% (89 runs sampled)
 * linestring-geometry x 427,791 ops/sec ±1.33% (88 runs sampled)
 * point-elevation x 1,542,262 ops/sec ±1.40% (84 runs sampled)
 * point-geometry x 2,060,711 ops/sec ±1.24% (86 runs sampled)
 * point x 2,009,496 ops/sec ±1.14% (86 runs sampled)
 * points x 704,826 ops/sec ±1.32% (81 runs sampled)
 * polygon x 240,593 ops/sec ±1.86% (90 runs sampled)
 * polygons x 117,259 ops/sec ±1.47% (91 runs sampled)
 */
const suite = new Benchmark.Suite('turf-truncate');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => truncate(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
