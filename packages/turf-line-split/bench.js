const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const lineSplit = require('./');

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
 * linestrings x 9,039 ops/sec ±15.06% (62 runs sampled)
 * multi-linestring x 16,715 ops/sec ±2.21% (78 runs sampled)
 * multi-polygon x 6,217 ops/sec ±2.34% (76 runs sampled)
 * multiPoint-on-line-1 x 18,841 ops/sec ±2.33% (76 runs sampled)
 * multiPoint-on-line-2 x 18,312 ops/sec ±8.65% (66 runs sampled)
 * point-on-line-1 x 48,059 ops/sec ±3.13% (79 runs sampled)
 * point-on-line-2 x 47,529 ops/sec ±2.92% (76 runs sampled)
 * point-on-line-3 x 144,408 ops/sec ±2.92% (75 runs sampled)
 * polygon-with-holes x 4,524 ops/sec ±2.63% (80 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-split');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineSplit(geojson.features[0], geojson.features[1]));
}

suite
    .on('cycle', e => { console.log(String(e.target)); })
    .on('complete', () => {})
    .run();
