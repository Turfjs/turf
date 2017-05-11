const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const lineOffset = require('./');

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
 * linestring-feature x 293,412 ops/sec ±1.42% (76 runs sampled)
 * linestring-geometry x 288,033 ops/sec ±2.62% (79 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-offset');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineOffset(geojson, 100, 'meters'));
}

suite
    .on('cycle', e => { console.log(String(e.target)); })
    .on('complete', () => {})
    .run();
