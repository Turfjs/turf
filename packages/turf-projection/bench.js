import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import { toMercator, toWgs84 } from './';

const suite = new Benchmark.Suite('turf-projection');

/**
 * Benchmark Results toMercator
 *
 * featureCollection: 3.501ms
 * fiji: 0.118ms
 * geometry: 0.081ms
 * line: 0.077ms
 * multiLine: 0.083ms
 * multiPolygon: 0.123ms
 * passed-180th-meridian: 0.044ms
 * passed-180th-meridian2: 0.151ms
 * point: 0.065ms
 * polygon: 0.060ms
 *
 *
 *
 *
 * 180th-meridian x 115,084 ops/sec ±2.82% (78 runs sampled)
 * featureCollection x 133,945 ops/sec ±7.66% (73 runs sampled)
 * line x 349,467 ops/sec ±3.93% (74 runs sampled)
 * multiLine x 139,763 ops/sec ±5.19% (71 runs sampled)
 * multiPolygon x 118,105 ops/sec ±4.80% (75 runs sampled)
 * point x 1,539,797 ops/sec ±3.72% (77 runs sampled)
 * polygon x 203,059 ops/sec ±16.43% (58 runs sampled)
 */
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
 * featureCollection: 2.290ms
 * fiji: 0.062ms
 * geometry: 0.109ms
 * multiLine: 0.060ms
 * multiPolygon: 0.075ms
 * passed-180th-meridian: 0.084ms
 * passed-180th-meridian2: 0.099ms
 * point: 0.037ms
 * polygon: 0.054ms
 *
 * featureCollection x 153,988 ops/sec ±3.13% (77 runs sampled)
 * fiji x 266,735 ops/sec ±1.90% (79 runs sampled)
 * geometry x 406,995 ops/sec ±1.91% (79 runs sampled)
 * multiLine x 175,761 ops/sec ±2.32% (77 runs sampled)
 * multiPolygon x 135,507 ops/sec ±1.95% (79 runs sampled)
 * passed-180th-meridian x 131,944 ops/sec ±2.04% (79 runs sampled)
 * passed-180th-meridian2 x 106,320 ops/sec ±1.91% (80 runs sampled)
 * point x 1,784,702 ops/sec ±2.29% (76 runs sampled)
 * polygon x 307,268 ops/sec ±1.95% (79 runs sampled)
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
