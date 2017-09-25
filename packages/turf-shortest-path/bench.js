const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const fs = require('fs');
const shortestPath = require('./');

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
 * simple: 57.895ms
 */
for (const {name, geojson} of fixtures) {
    const {start, end, obstacles, options} = geojson;
    console.time(name);
    shortestPath(start, end, obstacles, options);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * simple x 129 ops/sec ±4.53% (65 runs sampled)
 */
const suite = new Benchmark.Suite('turf-point-to-line-distance');
for (const {name, geojson} of fixtures) {
    const {start, end, obstacles, options} = geojson;
    suite.add(name, () => shortestPath(start, end, obstacles, options));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();

