import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import lineIntersect from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * 2-vertex-segment x 4,123,821 ops/sec ±12.92% (74 runs sampled)
 * double-intersect x 53,118 ops/sec ±4.22% (72 runs sampled)
 * multi-linestring x 16,417 ops/sec ±2.31% (77 runs sampled)
 * polygons-with-holes x 9,739 ops/sec ±2.55% (85 runs sampled)
 * same-coordinates x 51,303 ops/sec ±4.23% (71 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-intersect');
for (const {name, geojson} of fixtures) {
    const [line1, line2] = geojson.features;
    suite.add(name, () => lineIntersect(line1, line2));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
