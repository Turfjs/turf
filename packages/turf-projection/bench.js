const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const {toMercator, toWgs84} = require('./');

/**
 * Benchmark Results toMercator
 *
 * 180th-meridian: 0.953ms
 * featureCollection: 0.176ms
 * line: 0.069ms
 * multiLine: 0.045ms
 * multiPolygon: 0.107ms
 * point: 0.019ms
 * polygon: 0.029ms
 * 180th-meridian x 115,084 ops/sec ±2.82% (78 runs sampled)
 * featureCollection x 133,945 ops/sec ±7.66% (73 runs sampled)
 * line x 349,467 ops/sec ±3.93% (74 runs sampled)
 * multiLine x 139,763 ops/sec ±5.19% (71 runs sampled)
 * multiPolygon x 118,105 ops/sec ±4.80% (75 runs sampled)
 * point x 1,539,797 ops/sec ±3.72% (77 runs sampled)
 * polygon x 203,059 ops/sec ±16.43% (58 runs sampled)
 */
const suite = new Benchmark.Suite('turf-to-mercator');
glob.sync(path.join(__dirname, 'test', 'mercator', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    console.time(name);
    toMercator(geojson);
    console.timeEnd(name);
    suite.add(name, () => toMercator(geojson));
});

/**
 * Benchmark Results toWgs84
 *
 * 180th-meridian: 0.214ms
 * featureCollection: 0.061ms
 * line: 0.092ms
 * multiLine: 0.041ms
 * multiPolygon: 0.129ms
 * point: 0.033ms
 * polygon: 0.183ms
 * 180th-meridian x 66,890 ops/sec ±17.35% (57 runs sampled)
 * featureCollection x 79,898 ops/sec ±21.22% (58 runs sampled)
 * line x 375,125 ops/sec ±3.83% (73 runs sampled)
 * multiLine x 162,799 ops/sec ±2.82% (74 runs sampled)
 * multiPolygon x 117,025 ops/sec ±7.56% (71 runs sampled)
 * point x 1,750,843 ops/sec ±2.86% (63 runs sampled)
 * polygon x 294,754 ops/sec ±2.50% (77 runs sampled)
 */
glob.sync(path.join(__dirname, 'test', 'wgs84', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    console.time(name);
    toWgs84(geojson);
    console.timeEnd(name);
    suite.add(name, () => toWgs84(geojson));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
