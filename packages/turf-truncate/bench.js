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
 * // Macbook Pro (Early 2015) 2.7 GHz i5, 8GB RAM
 *
 * geometry-collection x 152,493 ops/sec ±0.87% (89 runs sampled)
 * geometry-collection [mutate=true] x 4,787,428 ops/sec ±1.32% (91 runs sampled)
 * linestring-geometry x 208,861 ops/sec ±5.49% (85 runs sampled)
 * linestring-geometry [mutate=true] x 3,304,503 ops/sec ±5.73% (73 runs sampled)
 * point-elevation x 160,623 ops/sec ±1.46% (90 runs sampled)
 * point-elevation [mutate=true] x 4,162,893 ops/sec ±1.97% (86 runs sampled)
 * point-geometry x 218,256 ops/sec ±14.40% (79 runs sampled)
 * point-geometry [mutate=true] x 4,406,686 ops/sec ±0.73% (89 runs sampled)
 * point x 154,165 ops/sec ±2.97% (83 runs sampled)
 * point [mutate=true] x 4,022,650 ops/sec ±4.12% (81 runs sampled)
 * points x 106,239 ops/sec ±0.80% (90 runs sampled)
 * points [mutate=true] x 4,065,737 ops/sec ±1.31% (86 runs sampled)
 * polygon x 120,447 ops/sec ±0.65% (88 runs sampled)
 * polygon [mutate=true] x 2,643,431 ops/sec ±3.24% (84 runs sampled)
 * polygons x 56,781 ops/sec ±2.39% (79 runs sampled)
 * polygons [mutate=true] x 1,513,817 ops/sec ±1.26% (85 runs sampled)
 */
const suite = new Benchmark.Suite('turf-truncate');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => truncate(geojson));
    suite.add(name + ' [mutate=true]', () => truncate(geojson, 6, 2, true));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
