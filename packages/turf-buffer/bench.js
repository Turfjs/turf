const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const buffer = require('./');

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
 * ==before==
 * feature-collection-points x 3,792 ops/sec ±10.41% (82 runs sampled)
 * geometry-collection-points x 4,346 ops/sec ±2.05% (90 runs sampled)
 * linestring x 9,087 ops/sec ±2.14% (89 runs sampled)
 * multi-linestring x 1,145 ops/sec ±9.46% (80 runs sampled)
 * multi-point x 4,898 ops/sec ±4.73% (78 runs sampled)
 * multi-polygon x 1,737 ops/sec ±9.31% (66 runs sampled)
 * point x 11,907 ops/sec ±8.10% (72 runs sampled)
 * polygon-with-holes x 6,417 ops/sec ±6.16% (79 runs sampled)
 *
 * ==after==
 * feature-collection-points x 6,198 ops/sec ±13.12% (58 runs sampled)
 * geometry-collection-points x 6,518 ops/sec ±13.37% (67 runs sampled)
 * linestring x 1,694 ops/sec ±4.85% (71 runs sampled)
 * multi-linestring x 466 ops/sec ±4.26% (77 runs sampled)
 * multi-point x 12,055 ops/sec ±5.63% (77 runs sampled)
 * multi-polygon x 202 ops/sec ±1.73% (83 runs sampled)
 * point x 43,109 ops/sec ±1.58% (89 runs sampled)
 * polygon-with-holes x 438 ops/sec ±1.70% (86 runs sampled)
 */
const suite = new Benchmark.Suite('turf-buffer');
for (const {name, geojson} of fixtures) {
    let {radius, units, padding} = geojson.properties || {};
    radius = radius || 50;
    units = units || 'miles';

    suite.add(name, () => buffer(geojson, radius, units, padding));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
