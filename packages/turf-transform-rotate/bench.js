const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const rotate = require('./');

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
 * line: 2.890ms
 * multiLine: 0.193ms
 * multiPoint: 0.536ms
 * multiPolygon: 2.388ms
 * no-rotation: 1.534ms
 * point: 0.081ms
 * polygon-with-hole: 0.487ms
 * polygon: 0.101ms
 */
for (const {name, geojson} of fixtures) {
    const {angle, pivot} = geojson.properties || {};
    console.time(name);
    rotate(geojson, angle, pivot);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * line x 47,694 ops/sec ±2.04% (86 runs sampled)
 * multiLine x 73,782 ops/sec ±8.17% (75 runs sampled)
 * multiPoint x 97,511 ops/sec ±10.13% (65 runs sampled)
 * multiPolygon x 5,636 ops/sec ±6.49% (78 runs sampled)
 * no-rotation x 21,993,476 ops/sec ±4.33% (82 runs sampled)
 * point x 398,703 ops/sec ±0.92% (87 runs sampled)
 * polygon-with-hole x 15,838 ops/sec ±0.90% (91 runs sampled)
 * polygon x 97,817 ops/sec ±14.22% (67 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-rotate');
for (const {name, geojson} of fixtures) {
    const {angle, pivot} = geojson.properties || {};
    suite.add(name, () => rotate(geojson, angle, pivot));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
