import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import centroid from './';

const fixtures = glob.sync(path.join(__dirname, 'test', 'in', '*.geojson')).map(input => {
    return {
        name: path.parse(input).name,
        geojson: load.sync(input)
    }
});

/**
 * Single Process Benchmark
 *
 * feature-collection: 0.528ms
 * imbalanced-polygon: 0.057ms
 * linestring: 0.041ms
 * point: 0.012ms
 * polygon: 0.016ms
 */
for (const {name, geojson} of fixtures) {
    console.time(name);
    centroid(geojson);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * feature-collection x 3,468,116 ops/sec ±0.94% (89 runs sampled)
 * imbalanced-polygon x 1,578,689 ops/sec ±2.81% (84 runs sampled)
 * linestring x 4,154,796 ops/sec ±2.72% (84 runs sampled)
 * point x 4,559,430 ops/sec ±4.39% (79 runs sampled)
 * polygon x 2,741,762 ops/sec ±2.29% (85 runs sampled)
 */
const suite = new Benchmark.Suite('turf-centroid');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => centroid(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
