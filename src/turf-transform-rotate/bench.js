import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import rotate from './';

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
 * line: 3.145ms
 * multiLine: 0.148ms
 * multiPoint: 1.137ms
 * multiPolygon: 5.770ms
 * no-rotation: 0.009ms
 * point: 0.032ms
 * polygon-with-hole: 0.823ms
 * polygon: 0.045ms
 * z-coord: 0.053ms
 */
for (const {name, geojson} of fixtures) {
    const {angle, pivot} = geojson.properties || {};
    console.time(name);
    rotate(geojson, angle, pivot, true);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * line x 66,571 ops/sec ±2.07% (86 runs sampled)
 * multiLine x 136,950 ops/sec ±2.39% (87 runs sampled)
 * multiPoint x 190,062 ops/sec ±1.96% (85 runs sampled)
 * multiPolygon x 9,588 ops/sec ±0.92% (91 runs sampled)
 * no-rotation x 35,080,702 ops/sec ±1.17% (87 runs sampled)
 * point x 732,603 ops/sec ±1.75% (83 runs sampled)
 * polygon-with-hole x 20,217 ops/sec ±4.15% (83 runs sampled)
 * polygon x 198,680 ops/sec ±3.38% (81 runs sampled)
 * z-coord x 139,558 ops/sec ±1.61% (86 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-rotate');
for (const {name, geojson} of fixtures) {
    const {angle, pivot} = geojson.properties || {};
    suite.add(name, () => rotate(geojson, angle, pivot, true));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
