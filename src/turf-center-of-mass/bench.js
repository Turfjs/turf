import fs from 'fs';
import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import centerOfMass from './';

const fixtures = glob.sync(path.join(__dirname, 'test', 'in', '*.geojson')).map(input => {
    return {
        name: path.parse(input).name,
        geojson: load.sync(input)
    }
});

/**
 * Single Process Benchmark
 *
 * feature-collection: 1.645ms
 * imbalanced-polygon: 0.073ms
 * linestring: 0.134ms
 * point: 0.253ms
 * polygon: 0.034ms
 */
for (const {name, geojson} of fixtures) {
    console.time(name);
    centerOfMass(geojson);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * feature-collection x 268,173 ops/sec ±1.69% (89 runs sampled)
 * imbalanced-polygon x 227,405 ops/sec ±1.76% (86 runs sampled)
 * linestring x 975,430 ops/sec ±3.57% (83 runs sampled)
 * point x 8,949,698 ops/sec ±2.01% (85 runs sampled)
 * polygon x 463,325 ops/sec ±1.73% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-center-of-mass');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => centerOfMass(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
