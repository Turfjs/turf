const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const overlaps = require('./');
const Benchmark = require('benchmark');

/**
 * Benchmark Results
 * lines: 0.824ms
 * multiline-polygon: 0.152ms
 * multipolygon-line: 0.099ms
 * multipolygon-multiline: 1.879ms
 * multipolygon-polygon: 0.322ms
 * polygon-line: 0.044ms
 * polygon-with-hole-polygon: 0.088ms
 * polygons: 0.098ms
 * geometries: 0.067ms
 * lines: 0.904ms
 * lines2: 0.070ms
 * multiline-polygon: 0.052ms
 * multipolygon-line: 0.025ms
 * multipolygon-multiline: 0.083ms
 * multipolygon-polygon: 0.037ms
 * polygon-line: 0.122ms
 * polygon-with-hole-line: 0.076ms
 * polygon-with-hole-polygon: 0.116ms
 * polygons: 0.068ms
 * polygons2: 0.050ms
 * lines x 152,592 ops/sec ±3.12% (72 runs sampled)
 * multiline-polygon x 215,290 ops/sec ±6.04% (64 runs sampled)
 * multipolygon-line x 185,348 ops/sec ±3.75% (76 runs sampled)
 * multipolygon-multiline x 122,911 ops/sec ±2.83% (77 runs sampled)
 * multipolygon-polygon x 66,818 ops/sec ±2.37% (79 runs sampled)
 * polygon-line x 475,840 ops/sec ±1.66% (65 runs sampled)
 * polygon-with-hole-polygon x 85,510 ops/sec ±2.26% (77 runs sampled)
 * polygons x 125,798 ops/sec ±3.29% (80 runs sampled)
 * geometries x 470,264 ops/sec ±1.65% (79 runs sampled)
 * lines x 211,284 ops/sec ±3.97% (72 runs sampled)
 * lines2 x 615,171 ops/sec ±1.50% (81 runs sampled)
 * multiline-polygon x 292,558 ops/sec ±1.98% (80 runs sampled)
 * multipolygon-line x 719,546 ops/sec ±1.75% (77 runs sampled)
 * multipolygon-multiline x 152,743 ops/sec ±2.46% (80 runs sampled)
 * multipolygon-polygon x 535,466 ops/sec ±2.57% (77 runs sampled)
 * polygon-line x 446,153 ops/sec ±4.79% (77 runs sampled)
 * polygon-with-hole-line x 275,506 ops/sec ±2.14% (80 runs sampled)
 * polygon-with-hole-polygon x 134,078 ops/sec ±1.76% (77 runs sampled)
 * polygons x 233,564 ops/sec ±2.38% (79 runs sampled)
 * polygons2 x 366,677 ops/sec ±2.11% (79 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-disjoint');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    overlaps(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => overlaps(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
