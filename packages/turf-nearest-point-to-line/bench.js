import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import nearestPointToLine from './';

/**
 * Benchmark Results
 *
 * fiji: 2.973ms
 * on-line: 0.758ms
 * one: 0.549ms
 * resolute: 0.349ms
 * two: 0.358ms
 *
 * fiji x 36,409 ops/sec ±4.14% (69 runs sampled)
 * on-line x 14,044 ops/sec ±4.92% (69 runs sampled)
 * one x 65,604 ops/sec ±11.55% (64 runs sampled)
 * resolute x 44,962 ops/sec ±6.76% (67 runs sampled)
 * two x 42,690 ops/sec ±2.34% (76 runs sampled)
 */
const suite = new Benchmark.Suite('turf-nearest-point-to-line');
glob.sync(path.join(__dirname, 'test', 'in', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [points, line] = geojson.features;
    console.time(name);
    nearestPointToLine(points, line);
    console.timeEnd(name);
    suite.add(name, () => nearestPointToLine(points, line));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
