import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import translate from './';

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
 * line: 1.364ms
 * multiLine: 0.072ms
 * multiPoint: 0.053ms
 * multiPolygon: 1.482ms
 * no-motion: 1.352ms
 * point: 0.022ms
 * polygon-with-hole: 0.100ms
 * polygon: 0.018ms
 * z-translation: 0.073ms
 */
for (const {name, geojson} of fixtures) {
    const {distance, direction, units, zTranslation} = geojson.properties || {};
    console.time(name);
    translate(geojson, distance, direction, units, zTranslation, true);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * line x 26,602 ops/sec ±2.77% (77 runs sampled)
 * multiLine x 56,968 ops/sec ±2.22% (79 runs sampled)
 * multiPoint x 55,514 ops/sec ±18.05% (58 runs sampled)
 * multiPolygon x 3,685 ops/sec ±2.36% (74 runs sampled)
 * no-motion x 17,622 ops/sec ±3.22% (75 runs sampled)
 * point x 121,712 ops/sec ±2.02% (79 runs sampled)
 * polygon-with-hole x 9,527 ops/sec ±2.52% (75 runs sampled)
 * polygon x 73,538 ops/sec ±5.07% (72 runs sampled)
 * z-translation x 44,638 ops/sec ±3.09% (78 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-translate');
for (const {name, geojson} of fixtures) {
    const {distance, direction, units, zTranslation} = geojson.properties || {};
    suite.add(name, () => translate(geojson, distance, direction, units, zTranslation));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
