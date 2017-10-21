import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import concave from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Single Process Benchmark
 *
 * concave-hull: 15.922ms
 * fiji: 3.523ms
 * hole: 8.207ms
 * issue-333: 24.505ms
 * pts1: 0.932ms
 * pts2: 13.297ms
 * pts3: 0.375ms
 */
for (const {name, geojson} of fixtures) {
    console.time(name);
    concave(geojson, geojson.properties);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * concave-hull x 616 ops/sec ±5.02% (77 runs sampled)
 * fiji x 1,815 ops/sec ±5.09% (80 runs sampled)
 * hole x 801 ops/sec ±2.29% (84 runs sampled)
 * issue-333 x 163 ops/sec ±10.20% (67 runs sampled)
 * pts1 x 2,697 ops/sec ±5.40% (79 runs sampled)
 * pts2 x 148 ops/sec ±2.66% (73 runs sampled)
 * pts3 x 6,938 ops/sec ±6.21% (71 runs sampled)
 * support-null-geometry x 3,110 ops/sec ±4.75% (74 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-scale');
for (const {name, geojson} of fixtures) {
    const options = geojson.properties;
    options.mutate = true;
    suite.add(name, () => concave(geojson, options));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
