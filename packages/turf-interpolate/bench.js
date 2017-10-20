import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import interpolate from './';

// Define Fixtures
const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * data-1km: 15.042ms
 * data-500m: 14.286ms
 * data-weight-2: 0.408ms
 * hex-zValue: 1.778ms
 * points-random: 20.676ms
 * points1-weight-3: 5.569ms
 * points1: 4.254ms
 * triangle-zValue: 3.519ms
 * data-1km x 1,585 ops/sec ±2.77% (80 runs sampled)
 * data-500m x 351 ops/sec ±2.59% (76 runs sampled)
 * data-weight-2 x 3,730 ops/sec ±1.55% (82 runs sampled)
 * hex-zValue x 2,854 ops/sec ±4.45% (72 runs sampled)
 * points-random x 265 ops/sec ±1.67% (75 runs sampled)
 * points1-weight-3 x 381 ops/sec ±2.06% (76 runs sampled)
 * points1 x 356 ops/sec ±1.83% (70 runs sampled)
 * triangle-zValue x 570 ops/sec ±1.69% (81 runs sampled)
 */
const suite = new Benchmark.Suite('turf-interpolate');
for (const {name, geojson} of fixtures) {
    const {property, cellSize, outputType, units, weight} = geojson.properties;

    console.time(name);
    interpolate(geojson, cellSize, outputType, property, units, weight);
    console.timeEnd(name);
    suite.add(name, () => interpolate(geojson, cellSize, outputType, property, units, weight));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
