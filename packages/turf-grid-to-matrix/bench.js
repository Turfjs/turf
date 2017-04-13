const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const gridToMatrix = require('./');

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
 * 3x4 x 28,271 ops/sec ±14.14% (63 runs sampled)
 * 8x8 x 10,233 ops/sec ±5.71% (73 runs sampled)
 */
const suite = new Benchmark.Suite('grid-to-matrix');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => gridToMatrix(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();

