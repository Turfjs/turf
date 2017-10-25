import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import difference from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});
// fixtures = fixtures.filter(({name}) => name === 'issue-#721');

/**
 * Benchmark Results
 *
 * ==using jsts==
 * clip-polygons x 2,512 ops/sec ±30.29% (71 runs sampled)
 * completely-overlapped x 6,777 ops/sec ±4.08% (78 runs sampled)
 * create-hole x 5,451 ops/sec ±9.92% (75 runs sampled)
 * issue-#721-inverse x 434,372 ops/sec ±3.40% (85 runs sampled)
 * issue-#721 x 421,194 ops/sec ±4.35% (80 runs sampled)
 * multi-polygon-input x 1,904 ops/sec ±5.16% (79 runs sampled)
 * multi-polygon-target x 1,240 ops/sec ±5.44% (79 runs sampled)
 * split-polygon x 2,468 ops/sec ±4.75% (82 runs sampled)
 */
const suite = new Benchmark.Suite('turf-difference');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => difference(geojson.features[0], geojson.features[1]));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
