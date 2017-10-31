import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import polygonToLine from './';

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
 * geometry-polygon x 10,766,300 ops/sec ±1.20% (88 runs sampled)
 * multi-polygon-with-holes x 2,597,052 ops/sec ±3.29% (81 runs sampled)
 * multi-polygon x 3,103,830 ops/sec ±2.59% (81 runs sampled)
 * polygon-with-hole x 10,533,741 ops/sec ±1.15% (88 runs sampled)
 * polygon x 10,651,632 ops/sec ±0.77% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-polygon-to-linestring');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => polygonToLine(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
