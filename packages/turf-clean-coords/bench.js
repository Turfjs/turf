const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const cleanCoords = require('./');

/**
 * Benchmark Results
 *
 * geometry: 0.675ms
 * multiline: 0.044ms
 * multipoint: 0.291ms
 * multipolygon: 0.062ms
 * point: 0.010ms
 * polygon-with-hole: 0.017ms
 * polygon: 0.010ms
 * simple-line: 0.008ms
 * triangle: 0.020ms
 * geometry x 3,053,905 ops/sec ±1.84% (87 runs sampled)
 * multiline x 3,943,840 ops/sec ±2.60% (85 runs sampled)
 * multipoint x 465,553 ops/sec ±1.04% (89 runs sampled)
 * multipolygon x 2,046,659 ops/sec ±0.77% (91 runs sampled)
 * point x 22,318,913 ops/sec ±1.20% (86 runs sampled)
 * polygon-with-hole x 3,109,098 ops/sec ±2.10% (91 runs sampled)
 * polygon x 4,603,124 ops/sec ±1.99% (84 runs sampled)
 * simple-line x 7,732,876 ops/sec ±1.18% (86 runs sampled)
 * triangle x 4,950,167 ops/sec ±1.36% (89 runs sampled)
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
