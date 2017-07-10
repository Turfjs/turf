const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const interpolate = require('./');

// Define Fixtures
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
 * data-1km: 14.950ms
 * data-500m: 12.788ms
 * data-weight-2: 0.319ms
 * points-random: 15.994ms
 * points1-weight-3: 2.797ms
 * points1: 2.052ms
 * data-1km x 1,592 ops/sec ±2.59% (76 runs sampled)
 * data-500m x 382 ops/sec ±2.18% (71 runs sampled)
 * data-weight-2 x 3,992 ops/sec ±2.05% (82 runs sampled)
 * points-random x 582 ops/sec ±1.98% (79 runs sampled)
 * points1-weight-3 x 602 ops/sec ±2.03% (81 runs sampled)
 * points1 x 544 ops/sec ±2.17% (77 runs sampled)
 */
const suite = new Benchmark.Suite('turf-interpolate');
for (const {name, geojson} of fixtures) {
    const {property, cellSize, outputType, units, weight} = geojson.properties;

    console.time(name);
    interpolate(geojson, cellSize, outputType, property, units, weight);
    console.timeEnd(name);
    suite.add(name, () => interpolate(geojson, cellSize, outputType, property, units, weight));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
