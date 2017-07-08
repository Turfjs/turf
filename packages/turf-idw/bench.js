const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const idw = require('./');

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
 * data-1km: 13.059ms
 * data-500m: 7.989ms
 * data-weight-2: 0.431ms
 * data-1km x 2,127 ops/sec ±1.43% (85 runs sampled)
 * data-500m x 530 ops/sec ±2.92% (77 runs sampled)
 * data-weight-2 x 5,909 ops/sec ±1.30% (85 runs sampled)
 */
const suite = new Benchmark.Suite('turf-idw');
for (const {geojson, name} of fixtures) {
    const {valueField, weight, cellWidth, units} = geojson.properties;

    console.time(name);
    idw(geojson, valueField, weight, cellWidth, units);
    console.timeEnd(name);
    suite.add(name, () => idw(geojson, valueField, weight, cellWidth, units));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
