const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const cleanCoords = require('./');

/**
 * Benchmark Results
 *
 * multiline: 1.030ms
 * multipoint: 0.078ms
 * multipolygon: 0.329ms
 * point: 0.060ms
 * polygon-with-hole: 0.191ms
 * polygon: 0.073ms
 * simple-line: 0.064ms
 * triangle: 0.105ms
 * multiline x 86,027 ops/sec ±2.78% (72 runs sampled)
 * multipoint x 112,741 ops/sec ±3.84% (74 runs sampled)
 * multipolygon x 49,881 ops/sec ±2.92% (75 runs sampled)
 * point x 163,172 ops/sec ±6.79% (68 runs sampled)
 * polygon-with-hole x 67,728 ops/sec ±3.33% (73 runs sampled)
 * polygon x 111,302 ops/sec ±3.23% (76 runs sampled)
 * simple-line x 136,383 ops/sec ±2.53% (76 runs sampled)
 * triangle x 93,747 ops/sec ±3.09% (76 runs sampled)
 */
const suite = new Benchmark.Suite('turf-clean-coords');
glob.sync(path.join(__dirname, 'test', 'in', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    console.time(name);
    cleanCoords(geojson);
    console.timeEnd(name);
    suite.add(name, () => cleanCoords(geojson));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
