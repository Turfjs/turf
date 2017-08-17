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
 * fiji: 17.973ms
 * issue-333: 31.418ms
 * pts1: 1.207ms
 * pts2: 17.366ms
 * pts3: 0.853ms
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
 * fiji x 1,513 ops/sec ±10.80% (63 runs sampled)
 * issue-333 x 183 ops/sec ±2.41% (74 runs sampled)
 * pts1 x 2,934 ops/sec ±2.35% (78 runs sampled)
 * pts2 x 136 ops/sec ±3.87% (67 runs sampled)
 * pts3 x 7,215 ops/sec ±9.04% (70 runs sampled)
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
