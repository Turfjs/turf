const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const rewind = require('./');

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
 * geometry-polygon-counter-clockwise x 10,379,811 ops/sec ±0.84% (89 runs sampled)
 * line-clockwise x 7,937,098 ops/sec ±1.13% (90 runs sampled)
 * line-counter-clockwise x 6,324,221 ops/sec ±5.40% (74 runs sampled)
 * polygon-clockwise x 8,941,337 ops/sec ±2.95% (81 runs sampled)
 * polygon-counter-clockwise x 7,625,375 ops/sec ±12.27% (72 runs sampled)
 */
const suite = new Benchmark.Suite('turf-rewind');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => rewind(geojson, false, true));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
