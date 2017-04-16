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
 * ==polygon-offset:after==
 * feature-collection-points x 6,905 ops/sec ±16.80% (70 runs sampled)
 * geometry-collection-points x 7,682 ops/sec ±9.08% (75 runs sampled)
 * linestring x 404 ops/sec ±1.54% (85 runs sampled)
 * multi-linestring x 117 ops/sec ±1.43% (73 runs sampled)
 * multi-point x 1,406 ops/sec ±17.23% (81 runs sampled)
 * multi-polygon x 38.88 ops/sec ±1.21% (51 runs sampled)
 * north-latitude-points x 552 ops/sec ±1.24% (84 runs sampled)
 * northern-polygon x 215 ops/sec ±2.45% (81 runs sampled)
 * point x 36,843 ops/sec ±6.75% (80 runs sampled)
 * polygon-with-holes x 74.91 ops/sec ±7.91% (63 runs sampled)
 *
 * ==jsts:before ==
 * feature-collection-points x 9,335 ops/sec ±1.37% (88 runs sampled)
 * geometry-collection-points x 9,505 ops/sec ±1.57% (86 runs sampled)
 * linestring x 7,977 ops/sec ±17.93% (75 runs sampled)
 * multi-linestring x 1,371 ops/sec ±2.00% (88 runs sampled)
 * multi-point x 515 ops/sec ±3.35% (85 runs sampled)
 * multi-polygon x 2,549 ops/sec ±3.03% (88 runs sampled)
 * north-latitude-points x 812 ops/sec ±2.31% (88 runs sampled)
 * point x 42,867 ops/sec ±1.38% (89 runs sampled)
 * polygon-with-holes x 7,397 ops/sec ±1.93% (88 runs sampled)
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
