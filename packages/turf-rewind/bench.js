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
 * geometry-polygon-counter-clockwise x 3,217,454 ops/sec ±4.31% (83 runs sampled)
 * line-clockwise x 2,249,133 ops/sec ±0.97% (90 runs sampled)
 * line-counter-clockwise x 2,224,334 ops/sec ±1.40% (87 runs sampled)
 * polygon-clockwise x 3,429,437 ops/sec ±1.49% (86 runs sampled)
 * polygon-counter-clockwise x 3,464,880 ops/sec ±1.05% (88 runs sampled)
 */
const suite = new Benchmark.Suite('turf-rewind');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => rewind(geojson, false, true));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
