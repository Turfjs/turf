import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import pointToLineDistance from './';


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
 * city-line1: 1.831ms
 * city-line2: 0.126ms
 * city-segment-inside1: 0.062ms
 * city-segment-inside2: 0.020ms
 * city-segment-inside3: 0.017ms
 * city-segment-obtuse1: 0.015ms
 * city-segment-obtuse2: 0.014ms
 * city-segment-projected1: 1.063ms
 * city-segment-projected2: 0.038ms
 * line-fiji: 2.927ms
 * line-resolute-bay: 0.890ms
 * line1: 1.707ms
 * line2: 0.286ms
 * segment-fiji: 0.039ms
 * segment1: 0.056ms
 * segment1a: 0.076ms
 * segment2: 0.037ms
 * segment3: 0.014ms
 * segment4: 0.036ms
 */
for (const {name, geojson} of fixtures) {
    const [point, line] = geojson.features;
    let {units, mercator} = geojson.properties || {};
    if (!units) units = 'kilometers';
    console.time(name);
    pointToLineDistance(point, line, units, mercator);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * city-line1 x 107,569 ops/sec ±2.27% (74 runs sampled)
 * city-line2 x 178,356 ops/sec ±3.72% (75 runs sampled)
 * city-segment-inside1 x 398,862 ops/sec ±2.21% (77 runs sampled)
 * city-segment-inside2 x 428,360 ops/sec ±2.42% (76 runs sampled)
 * city-segment-inside3 x 425,725 ops/sec ±4.35% (69 runs sampled)
 * city-segment-obtuse1 x 499,109 ops/sec ±4.21% (68 runs sampled)
 * city-segment-obtuse2 x 472,099 ops/sec ±7.23% (67 runs sampled)
 * city-segment-projected1 x 393,555 ops/sec ±4.40% (75 runs sampled)
 * city-segment-projected2 x 340,438 ops/sec ±7.92% (65 runs sampled)
 * line-fiji x 10,405 ops/sec ±8.59% (65 runs sampled)
 * line-resolute-bay x 62,464 ops/sec ±6.39% (68 runs sampled)
 * line1 x 18,020 ops/sec ±2.37% (75 runs sampled)
 * line2 x 51,268 ops/sec ±2.47% (78 runs sampled)
 * segment-fiji x 143,025 ops/sec ±2.30% (77 runs sampled)
 * segment1 x 137,980 ops/sec ±2.05% (80 runs sampled)
 * segment1a x 123,837 ops/sec ±4.81% (72 runs sampled)
 * segment2 x 119,494 ops/sec ±8.84% (69 runs sampled)
 * segment3 x 132,251 ops/sec ±18.05% (50 runs sampled)
 * segment4 x 89,967 ops/sec ±12.14% (57 runs sampled)
 */
const suite = new Benchmark.Suite('turf-point-to-line-distance');
for (const {name, geojson} of fixtures) {
    const [point, line] = geojson.features;
    let {units, mercator} = geojson.properties || {};
    if (!units) units = 'kilometers';
    suite.add(name, () => pointToLineDistance(point, line, units, mercator));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
