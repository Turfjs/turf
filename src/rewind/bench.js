import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import rewind from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});
// fixtures = fixtures.filter(fixture => fixture.name === 'polygons');

/**
 * Benchmark Results
 *
 * feature-collection x 2,476,533 ops/sec ±2.44% (80 runs sampled)
 * geometry-polygon-counter-clockwise x 7,422,622 ops/sec ±1.79% (87 runs sampled)
 * line-clockwise x 5,845,725 ops/sec ±1.55% (86 runs sampled)
 * line-counter-clockwise x 5,889,989 ops/sec ±1.03% (88 runs sampled)
 * polygon-clockwise x 4,898,849 ops/sec ±8.02% (75 runs sampled)
 * polygon-counter-clockwise x 6,586,601 ops/sec ±6.10% (82 runs sampled)
 */
const suite = new Benchmark.Suite('turf-rewind');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => rewind(geojson, false, true));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
