const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const polygonToLineString = require('./index-before');

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
 * ==Before==
 * geometry x 637,469 ops/sec ±0.72% (91 runs sampled)
 * multipolygon x 625,724 ops/sec ±1.53% (91 runs sampled)
 * poly_not_feature x 872,408 ops/sec ±1.37% (88 runs sampled)
 * polygon x 899,319 ops/sec ±1.04% (88 runs sampled)
 * polygon_hole x 655,762 ops/sec ±0.92% (88 runs sampled)
 *
 * ==After==
 * geometry-polygon x 8,237,334 ops/sec ±1.12% (92 runs sampled)
 * multi-polygon-with-holes x 2,665,487 ops/sec ±1.62% (88 runs sampled)
 * multi-polygon x 3,109,822 ops/sec ±1.13% (87 runs sampled)
 * polygon-with-hole x 8,212,111 ops/sec ±0.94% (88 runs sampled)
 * polygon x 8,468,172 ops/sec ±0.96% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-polygon-to-linestring');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => polygonToLineString(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
