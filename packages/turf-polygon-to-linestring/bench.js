const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const polygonToLineString = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * geometry-polygon x 8,237,334 ops/sec ±1.12% (92 runs sampled)
 * multi-polygon-with-holes x 2,665,487 ops/sec ±1.62% (88 runs sampled)
 * multi-polygon x 3,109,822 ops/sec ±1.13% (87 runs sampled)
 * polygon-with-hole x 8,212,111 ops/sec ±0.94% (88 runs sampled)
 * polygon x 8,468,172 ops/sec ±0.96% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-polygon-to-linestring');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => polygonToLineString(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
