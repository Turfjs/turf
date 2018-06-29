import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import simplify from './';

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
 * argentina: 4.695ms
 * featurecollection: 1.647ms
 * fiji-hiQ: 0.461ms
 * geometrycollection: 3.332ms
 * linestring: 0.460ms
 * multilinestring: 0.657ms
 * multipoint: 0.193ms
 * multipolygon: 6.108ms
 * point: 0.032ms
 * poly-issue#555-5: 4.956ms
 * polygon: 0.675ms
 * simple-polygon: 2.735ms
 */
for (const {name, geojson} of fixtures) {
    let {tolerance, highQuality} = geojson.properties || {};
    tolerance = tolerance || 0.01;
    highQuality = highQuality || false;
    console.time(name);
    simplify(geojson, tolerance, highQuality);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * argentina x 13,380 ops/sec ±4.31% (72 runs sampled)
 * featurecollection x 4,709 ops/sec ±2.24% (76 runs sampled)
 * fiji-hiQ x 41,197 ops/sec ±1.96% (80 runs sampled)
 * geometrycollection x 4,690 ops/sec ±2.25% (78 runs sampled)
 * linestring x 29,737 ops/sec ±2.26% (77 runs sampled)
 * multilinestring x 20,530 ops/sec ±2.08% (77 runs sampled)
 * multipoint x 394,980 ops/sec ±2.35% (77 runs sampled)
 * multipolygon x 809 ops/sec ±3.32% (70 runs sampled)
 * point x 5,157,027 ops/sec ±8.79% (72 runs sampled)
 * poly-issue#555-5 x 1,816 ops/sec ±2.43% (66 runs sampled)
 * polygon x 2,996 ops/sec ±2.85% (74 runs sampled)
 * simple-polygon x 369 ops/sec ±7.55% (66 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-simplify');
for (const {name, geojson} of fixtures) {
    let {tolerance, highQuality} = geojson.properties || {};
    tolerance = tolerance || 0.01;
    highQuality = highQuality || false;
    suite.add(name, () => simplify(geojson, tolerance, highQuality));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
