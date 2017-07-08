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
 * points-random: 18.246ms
 * points1: 12.013ms
 * points-random x 607 ops/sec ±2.56% (76 runs sampled)
 * points1 x 533 ops/sec ±2.13% (78 runs sampled)
 */
const suite = new Benchmark.Suite('turf-interpolate');
for (const {name, geojson} of fixtures) {
    const {property, cellSize, units, weight} = geojson.properties;

    console.time(name);
    interpolate(geojson, cellSize, property, units, weight);
    console.timeEnd(name);
    suite.add(name, () => interpolate(geojson, cellSize, property, units, weight));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
