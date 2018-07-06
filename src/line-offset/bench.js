import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import lineOffset from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});
// fixtures = fixtures.filter(fixture => fixture.name === 'polygon');

/**
 * Benchmark Results
 *
 * line-horizontal x 1,816,451 ops/sec ±15.31% (62 runs sampled)
 * linestring-long x 144,640 ops/sec ±3.35% (82 runs sampled)
 * linestring-singleSegmentOnly x 2,649,959 ops/sec ±1.54% (76 runs sampled)
 * linestring-straight x 1,857,452 ops/sec ±5.83% (77 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-offset');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineOffset(geojson, 100, 'meters'));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
