const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
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
 * feature-collection-points x 1,205 ops/sec ±11.92% (72 runs sampled)
 * geometry-collection-points x 2,102 ops/sec ±4.49% (78 runs sampled)
 * linestring x 3,434 ops/sec ±3.17% (80 runs sampled)
 * multi-linestring x 675 ops/sec ±2.89% (85 runs sampled)
 * multi-point x 2,077 ops/sec ±5.69% (73 runs sampled)
 * multi-polygon x 1,120 ops/sec ±5.97% (80 runs sampled)
 * north-latitude-points x 1,649 ops/sec ±2.09% (86 runs sampled)
 * northern-polygon x 4,658 ops/sec ±3.08% (78 runs sampled)
 * point x 65,020 ops/sec ±1.29% (85 runs sampled)
 * polygon-with-holes x 2,795 ops/sec ±2.98% (81 runs sampled)
 */
const suite = new Benchmark.Suite('turf-buffer');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => buffer(geojson, 50, 'miles'));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
