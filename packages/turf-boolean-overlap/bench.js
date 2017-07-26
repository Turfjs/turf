const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const overlap = require('./');
const Benchmark = require('benchmark');

/**
 * Benchmark Results
 *
 * equal-linear-rings: 2.348ms
 * equal-lines-inverse: 0.319ms
 * equal-multipoints: 0.703ms
 * equal-polygons: 0.343ms
 * linear-rings: 19.876ms
 * lines: 1.244ms
 * multipoints: 1.003ms
 * polygon-with-hole-polygon: 1.822ms
 * polygons: 0.242ms
 * linear-rings: 5.881ms
 * lines: 8.569ms
 * multipoints: 0.082ms
 * polygon-with-hole-polygon: 1.158ms
 * polygons: 0.114ms
 * simple-lines: 0.724ms
 * single-multipoints: 0.055ms
 * equal-linear-rings x 39,585 ops/sec ±24.47% (40 runs sampled)
 * equal-lines-inverse x 52,454 ops/sec ±24.98% (59 runs sampled)
 * equal-multipoints x 24,361 ops/sec ±10.90% (59 runs sampled)
 * equal-polygons x 36,479 ops/sec ±22.33% (48 runs sampled)
 * linear-rings x 2,625 ops/sec ±16.13% (47 runs sampled)
 * lines x 6,756 ops/sec ±5.54% (70 runs sampled)
 * multipoints x 234,229 ops/sec ±7.44% (64 runs sampled)
 * polygon-with-hole-polygon x 34,922 ops/sec ±6.70% (61 runs sampled)
 * polygons x 79,687 ops/sec ±2.98% (79 runs sampled)
 * linear-rings x 3,252 ops/sec ±5.96% (66 runs sampled)
 * lines x 4,328 ops/sec ±8.67% (63 runs sampled)
 * multipoints x 285,695 ops/sec ±2.91% (77 runs sampled)
 * polygon-with-hole-polygon x 39,154 ops/sec ±2.30% (80 runs sampled)
 * polygons x 79,419 ops/sec ±2.21% (77 runs sampled)
 * simple-lines x 7,479 ops/sec ±3.99% (71 runs sampled)
 * single-multipoints x 232,414 ops/sec ±13.49% (67 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-disjoint');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    overlap(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => overlap(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
