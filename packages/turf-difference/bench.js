const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const difference = require('./');

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
 * polygons-with-holes x 6,239 ops/sec ±1.20% (87 runs sampled)
 * simple x 32,934 ops/sec ±1.21% (86 runs sampled)
 * split-to-multipolygon-with-holes x 15,805 ops/sec ±1.13% (83 runs sampled)
 * split-to-multipolygon x 22,732 ops/sec ±1.97% (86 runs sampled)
 */
const suite = new Benchmark.Suite('turf-difference');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => difference(geojson.features[0], geojson.features[1]));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
