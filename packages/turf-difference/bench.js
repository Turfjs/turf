const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const difference = require('./');

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
 * completely-overlapped x 70,903 ops/sec ±4.07% (80 runs sampled)
 * multi-polygon-input x 14,147 ops/sec ±1.50% (86 runs sampled)
 * multi-polygon-target x 9,252 ops/sec ±1.25% (88 runs sampled)
 * polygons-with-holes x 5,673 ops/sec ±2.98% (84 runs sampled)
 * simple x 26,264 ops/sec ±9.35% (74 runs sampled)
 * split-to-multipolygon-with-holes x 13,678 ops/sec ±5.52% (79 runs sampled)
 * split-to-multipolygon x 22,073 ops/sec ±1.61% (85 runs sampled)
 *
 * ==using jsts==
 * completely-overlapped x 4,841 ops/sec ±22.20% (69 runs sampled)
 * multi-polygon-input x 1,794 ops/sec ±13.80% (69 runs sampled)
 * multi-polygon-target x 1,368 ops/sec ±7.53% (71 runs sampled)
 * polygons-with-holes: ERROR
 * simple x 2,918 ops/sec ±7.49% (68 runs sampled)
 * split-to-multipolygon-with-holes x 1,684 ops/sec ±10.29% (62 runs sampled)
 * split-to-multipolygon x 2,676 ops/sec ±5.12% (79 runs sampled)
 */
const suite = new Benchmark.Suite('turf-difference');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => difference(geojson.features[0], geojson.features[1]));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
