import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import centerMean from './';

const fixtures = glob.sync(path.join(__dirname, 'test', 'in', '*.geojson')).map(input => {
    return {
        name: path.parse(input).name,
        geojson: load.sync(input)
    }
});

/**
 * Single Process Benchmark
 *
 * feature-collection: 0.445ms
 * imbalanced-polygon: 0.051ms
 * linestring: 0.027ms
 * point: 0.011ms
 * polygon: 0.013ms
 */
for (const {name, geojson} of fixtures) {
    console.time(name);
    centerMean(geojson);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * feature-collection x 2,786,700 ops/sec ±1.50% (83 runs sampled)
 * imbalanced-polygon x 1,364,145 ops/sec ±3.33% (76 runs sampled)
 * linestring x 4,104,106 ops/sec ±4.16% (81 runs sampled)
 * point x 4,901,692 ops/sec ±5.23% (81 runs sampled)
 * polygon x 2,862,759 ops/sec ±1.14% (86 runs sampled)
 */
const suite = new Benchmark.Suite('turf-center-mean');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => centerMean(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
