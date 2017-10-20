import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import sector from './';

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
 * sector-full-360 x 29,179 ops/sec ±2.42% (76 runs sampled)
 * sector-greater-360 x 296,103 ops/sec ±10.92% (65 runs sampled)
 * sector1 x 189,709 ops/sec ±3.46% (75 runs sampled)
 * sector2 x 72,365 ops/sec ±2.11% (77 runs sampled)
 * sector3 x 38,093 ops/sec ±2.97% (77 runs sampled)
 * sector4 x 210,468 ops/sec ±2.58% (78 runs sampled)
 * sector5 x 26,438 ops/sec ±9.98% (70 runs sampled)
 * sector6 x 29,032 ops/sec ±2.36% (70 runs sampled)
 */
const suite = new Benchmark.Suite('turf-sector');
for (const {name, geojson} of fixtures) {
    const {radius, bearing1, bearing2} = geojson.properties;
    suite.add(name, () => sector(geojson, radius, bearing1, bearing2));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
