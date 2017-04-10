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
 * sector-full-360 x 46,260 ops/sec ±0.96% (91 runs sampled)
 * sector-greater-360 x 516,991 ops/sec ±1.13% (88 runs sampled)
 * sector1 x 271,179 ops/sec ±5.04% (82 runs sampled)
 * sector2 x 105,831 ops/sec ±2.57% (86 runs sampled)
 * sector3 x 56,994 ops/sec ±1.29% (89 runs sampled)
 * sector4 x 37,871 ops/sec ±3.13% (86 runs sampled)
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
