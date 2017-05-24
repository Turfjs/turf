const path = require('path');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const fs = require('fs');
const rotate = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});


/**
 * Benchmark Results
 *
 * line x 24,493 ops/sec ±1.89% (75 runs sampled)
 * multiLine x 44,038 ops/sec ±2.65% (74 runs sampled)
 * multiPoint x 66,089 ops/sec ±2.21% (76 runs sampled)
 * multiPolygon x 2,478 ops/sec ±10.86% (56 runs sampled)
 * no-rotation x 4,989 ops/sec ±17.30% (40 runs sampled)
 * point x 49,158 ops/sec ±25.83% (42 runs sampled)
 * polygon-with-hole x 3,125 ops/sec ±16.74% (44 runs sampled)
 * polygon x 41,617 ops/sec ±14.82% (51 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-rotate');
for (const {name, geojson} of fixtures) {
    let {angle, pivot} = geojson.properties || {};
    suite.add(name, () => rotate(geojson, angle, pivot));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
