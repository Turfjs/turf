import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import scale from './';

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
 * line: 3.586ms
 * multiLine: 0.228ms
 * multiPoint: 3.490ms
 * multiPolygon: 2.211ms
 * no-scale: 0.336ms
 * point: 0.038ms
 * poly-double: 2.511ms
 * poly-half: 0.176ms
 * polygon-with-hole: 1.094ms
 * polygon: 0.143ms
 * z-scaling: 0.237ms
 */
for (const {name, geojson} of fixtures) {
    const {factor, origin} = geojson.properties || {};
    console.time(name);
    scale(geojson, factor, origin, true);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * line x 15,591 ops/sec ±2.38% (77 runs sampled)
 * multiLine x 27,635 ops/sec ±2.27% (78 runs sampled)
 * multiPoint x 19,728 ops/sec ±2.18% (76 runs sampled)
 * multiPolygon x 2,178 ops/sec ±2.31% (77 runs sampled)
 * no-scale x 28,279 ops/sec ±2.48% (76 runs sampled)
 * point x 138,281 ops/sec ±2.48% (76 runs sampled)
 * poly-double x 34,934 ops/sec ±2.05% (76 runs sampled)
 * poly-half x 33,563 ops/sec ±2.49% (74 runs sampled)
 * polygon-with-hole x 5,046 ops/sec ±3.55% (75 runs sampled)
 * polygon x 35,747 ops/sec ±2.65% (77 runs sampled)
 * z-scaling x 26,205 ops/sec ±2.05% (75 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-scale');
for (const {name, geojson} of fixtures) {
    const {factor, origin} = geojson.properties || {};
    suite.add(name, () => scale(geojson, factor, origin));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
