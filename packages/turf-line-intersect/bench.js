const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const lineIntersect = require('./');

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
 * 2-vertex-segment x 7,177,957 ops/sec ±0.83% (92 runs sampled)
 * double-intersect x 88,165 ops/sec ±3.02% (78 runs sampled)
 * multi-linestring x 19,554 ops/sec ±2.09% (77 runs sampled)
 * multi-polygon x 11,149 ops/sec ±2.05% (74 runs sampled)
 * same-coordinates x 67,439 ops/sec ±2.01% (73 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-intersect');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineIntersect(geojson.features[0], geojson.features[1]));
}

suite
    .on('cycle', e => { console.log(String(e.target)); })
    .on('complete', () => {})
    .run();
