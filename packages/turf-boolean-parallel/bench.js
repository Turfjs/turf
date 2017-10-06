import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import booleanParallel from './';

/**
 * Benchmark Results
 *
 * line1: 2.578ms
 * line2: 0.137ms
 * city-line: 0.096ms
 * fiji: 0.073ms
 * geometry: 0.123ms
 * line1: 0.068ms
 * line3-reverse: 0.065ms
 * line3: 0.429ms
 * resolute: 0.077ms
 * segment1: 0.203ms
 * segment2: 0.087ms
 * segment3: 0.698ms
 *
 * line1 x 171,462 ops/sec ±2.03% (79 runs sampled)
 * line2 x 160,366 ops/sec ±6.55% (80 runs sampled)
 * city-line x 120,544 ops/sec ±8.47% (73 runs sampled)
 * fiji x 101,793 ops/sec ±5.09% (75 runs sampled)
 * geometry x 93,106 ops/sec ±7.57% (74 runs sampled)
 * line1 x 102,175 ops/sec ±4.95% (80 runs sampled)
 * line3-reverse x 129,695 ops/sec ±2.11% (82 runs sampled)
 * line3 x 129,860 ops/sec ±2.32% (83 runs sampled)
 * resolute x 136,275 ops/sec ±2.89% (79 runs sampled)
 * segment1 x 193,214 ops/sec ±4.31% (76 runs sampled)
 * segment2 x 205,418 ops/sec ±2.16% (83 runs sampled)
 * segment3 x 212,381 ops/sec ±1.79% (83 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-parallel');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [line1, line2] = geojson.features;

    console.time(name);
    booleanParallel(line1, line2);
    console.timeEnd(name);
    suite.add(name, () => booleanParallel(line1, line2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
