const path = require('path');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const fs = require('fs');
const translate = require('./');

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
 * line x 48,600 ops/sec ±2.90% (74 runs sampled)
 * multiLine x 86,384 ops/sec ±2.33% (77 runs sampled)
 * multiPoint x 113,514 ops/sec ±3.20% (74 runs sampled)
 * multiPolygon x 6,712 ops/sec ±2.15% (77 runs sampled)
 * no-motion x 24,466 ops/sec ±2.86% (78 runs sampled)
 * point x 245,205 ops/sec ±2.00% (81 runs sampled)
 * polygon-with-hole x 17,681 ops/sec ±2.07% (78 runs sampled)
 * polygon x 117,984 ops/sec ±2.56% (76 runs sampled)
 * z-translation x 83,989 ops/sec ±3.72% (77 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-translate');
for (const {name, geojson} of fixtures) {
    let {distance, direction, units, zTranslation} = geojson.properties || {};
    suite.add(name, () => translate(geojson, distance, direction, units, zTranslation));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
