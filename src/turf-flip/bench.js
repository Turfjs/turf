import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import flip from './';

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
 * feature-collection-points x 7,937,394 ops/sec ±1.43% (89 runs sampled)
 * linestring x 6,496,534 ops/sec ±1.75% (86 runs sampled)
 * point-with-elevation x 10,779,300 ops/sec ±2.08% (84 runs sampled)
 * polygon x 4,454,602 ops/sec ±3.45% (86 runs sampled)
 */
const suite = new Benchmark.Suite('turf-flip');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => flip(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
