const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const sector = require('./');

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
 * sector-full-360 x 45,292 ops/sec ±1.33% (89 runs sampled)
 * sector-greater-360 x 379,941 ops/sec ±10.07% (70 runs sampled)
 * sector1 x 291,012 ops/sec ±1.83% (90 runs sampled)
 * sector2 x 110,804 ops/sec ±1.39% (91 runs sampled)
 * sector3 x 57,071 ops/sec ±0.78% (91 runs sampled)
 * sector4 x 39,117 ops/sec ±0.93% (93 runs sampled)
 */
const suite = new Benchmark.Suite('turf-sector');
for (const {name, geojson} of fixtures) {
    const {radius, bearing1, bearing2} = geojson.properties;
    suite.add(name, () => sector(geojson, radius, bearing1, bearing2));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
