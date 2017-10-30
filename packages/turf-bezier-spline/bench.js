import Benchmark from 'benchmark';
import path from 'path';
import fs from 'fs';
import load from 'load-json-file';
import bezierSpline from './';

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
 * bezierIn x 771 ops/sec ±1.31% (88 runs sampled)
 * simple x 768 ops/sec ±1.20% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-bezier-spline');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => bezierSpline(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
