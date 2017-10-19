import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import convex from './';

const suite = new Benchmark.Suite('turf-convex');

/**
 * Benchmark Results
 *
 * elevation1 x 29,686 ops/sec ±1.77% (89 runs sampled)
 * elevation2 x 104,874 ops/sec ±1.33% (86 runs sampled)
 * elevation3 x 29,688 ops/sec ±1.77% (89 runs sampled)
 * elevation4 x 103,112 ops/sec ±1.26% (85 runs sampled)
 * elevation5 x 39,251 ops/sec ±1.32% (82 runs sampled)
 */
glob.sync(path.join(__dirname, 'test', 'in', '*.geojson')).forEach(filepath => {
    const geojson = load.sync(filepath);
    suite.add(path.parse(filepath).name, () => convex(geojson));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
