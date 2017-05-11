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
 * linestring-feature x 640,105 ops/sec ±1.90% (87 runs sampled)
 * linestring-geometry x 633,886 ops/sec ±1.53% (92 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-offset');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineOffset(geojson, 100, 'meters'));
}

suite
    .on('cycle', e => { console.log(String(e.target)); })
    .on('complete', () => {})
    .run();
