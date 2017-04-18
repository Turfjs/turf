const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const flip = require('./');

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
 *
 * ==original==
 * feature-collection-points x 133,182 ops/sec ±1.01% (86 runs sampled)
 * linestring x 136,473 ops/sec ±0.88% (93 runs sampled)
 * point-with-elevation x 268,397 ops/sec ±1.09% (89 runs sampled)
 * polygon x 97,702 ops/sec ±1.42% (91 runs sampled)
 */
const suite = new Benchmark.Suite('turf-flip');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => flip(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
