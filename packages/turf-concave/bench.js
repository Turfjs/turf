const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const concave = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Single Process Benchmark
 *
 * issue-333: 651.884ms
 * pts1: 6.568ms
 * pts2: 476.032ms
 */
for (const {name, geojson} of fixtures) {
    const {maxEdge, units} = geojson.properties || {maxEdge: 1};
    console.time(name);
    concave(geojson, maxEdge, units);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * issue-333 x 5.57 ops/sec ±10.65% (18 runs sampled)
 * pts1 x 315 ops/sec ±3.48% (70 runs sampled)
 * pts2 x 4.51 ops/sec ±2.28% (16 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-scale');
for (const {name, geojson} of fixtures) {
    const {maxEdge, units} = geojson.properties || {maxEdge: 1};
    suite.add(name, () => concave(geojson, maxEdge, units));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
