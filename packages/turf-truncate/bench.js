const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const truncate = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});
// fixtures = fixtures.filter(fixture => fixture.name === 'polygons');

/**
 * Benchmark Results
 *
 * geometry-collection x 4,874,653 ops/sec ±3.38% (89 runs sampled)
 * linestring-geometry x 4,086,885 ops/sec ±5.77% (83 runs sampled)
 * point-elevation x 4,537,175 ops/sec ±1.94% (85 runs sampled)
 * point-geometry x 4,896,260 ops/sec ±1.19% (93 runs sampled)
 * point x 4,751,705 ops/sec ±0.86% (90 runs sampled)
 * points x 4,380,515 ops/sec ±4.56% (85 runs sampled)
 * polygon x 2,652,124 ops/sec ±5.72% (81 runs sampled)
 * polygons x 1,551,027 ops/sec ±6.23% (84 runs sampled)
 */
const suite = new Benchmark.Suite('turf-truncate');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => truncate(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
