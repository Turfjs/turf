import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import equal from './';
import Benchmark from 'benchmark';

/**
 * Benchmark Results
 *
 * linear-rings: 1.167ms
 * lines: 0.132ms
 * multipoints: 1.283ms
 * points: 0.043ms
 * polygons: 0.387ms
 * linear-rings: 0.166ms
 * lines: 0.068ms
 * multipoints: 0.148ms
 * points: 0.029ms
 * polygons: 0.131ms
 * reverse-lines: 0.711ms
 * reverse-polygons: 0.090ms
 * linear-rings x 337,778 ops/sec ±2.95% (76 runs sampled)
 * lines x 367,227 ops/sec ±2.50% (78 runs sampled)
 * multipoints x 54,325 ops/sec ±1.71% (80 runs sampled)
 * points x 529,881 ops/sec ±3.62% (74 runs sampled)
 * polygons x 177,515 ops/sec ±2.34% (80 runs sampled)
 * linear-rings x 92,709 ops/sec ±1.51% (82 runs sampled)
 * lines x 94,539 ops/sec ±2.52% (81 runs sampled)
 * multipoints x 34,458 ops/sec ±2.21% (81 runs sampled)
 * points x 384,832 ops/sec ±2.74% (81 runs sampled)
 * polygons x 71,289 ops/sec ±2.67% (77 runs sampled)
 * reverse-lines x 83,612 ops/sec ±3.31% (77 runs sampled)
 * reverse-polygons x 64,686 ops/sec ±1.91% (76 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-equal');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    equal(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => equal(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();

