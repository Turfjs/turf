import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import lineSplit from './';

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
 * issue-#852 x 51,581 ops/sec ±10.24% (43 runs sampled)
 * linestrings x 4,177 ops/sec ±7.29% (45 runs sampled)
 * multi-linestring x 8,461 ops/sec ±7.81% (64 runs sampled)
 * multi-polygon x 4,045 ops/sec ±3.07% (68 runs sampled)
 * multiPoint-on-line-1 x 11,468 ops/sec ±3.80% (67 runs sampled)
 * multiPoint-on-line-2 x 14,668 ops/sec ±3.70% (70 runs sampled)
 * point-on-line-1 x 30,573 ops/sec ±3.94% (73 runs sampled)
 * point-on-line-2 x 32,557 ops/sec ±3.21% (73 runs sampled)
 * point-on-line-3 x 104,831 ops/sec ±4.35% (54 runs sampled)
 * polygon-with-holes x 3,260 ops/sec ±3.41% (68 runs sampled)
 * polygon x 12,352 ops/sec ±3.88% (62 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-split');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineSplit(geojson.features[0], geojson.features[1]));
}

suite
    .on('cycle', e => { console.log(String(e.target)); })
    .on('complete', () => {})
    .run();
