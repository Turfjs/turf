import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import polygonSmooth from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * close x 142,605 ops/sec ±1.84% (94 runs sampled)
 * polygon x 157,104 ops/sec ±3.32% (84 runs sampled)
 */
const suite = new Benchmark.Suite('turf-polygon-polygonSmooth');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => polygonSmooth(geojson, {iterations: 3}));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
