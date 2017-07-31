const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const lineOffset = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 * complex x 17,634 ops/sec ±1.63% (88 runs sampled)
 * rectangle x 33,735 ops/sec ±2.27% (92 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-offset');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineOffset(geojson, 100, 'meters'));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
