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
 * feature-collection-points x 9,876 ops/sec ±0.88% (89 runs sampled)
 * geometry-collection-points x 9,919 ops/sec ±0.90% (91 runs sampled)
 * linestring x 219 ops/sec ±1.37% (83 runs sampled)
 * multi-linestring x 61.91 ops/sec ±4.88% (64 runs sampled)
 * multi-point x 995 ops/sec ±24.51% (82 runs sampled)
 * multi-polygon x 42.77 ops/sec ±0.92% (56 runs sampled)
 * north-latitude-points x 842 ops/sec ±1.23% (91 runs sampled)
 * northern-polygon x 236 ops/sec ±1.83% (83 runs sampled)
 * point x 43,814 ops/sec ±1.19% (94 runs sampled)
 * polygon-with-holes x 79.33 ops/sec ±16.13% (65 runs sampled)
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
