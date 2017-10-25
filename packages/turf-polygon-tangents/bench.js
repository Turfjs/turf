import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import tangents from './';

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
 * concave x 2,575,215 ops/sec ±0.87% (93 runs sampled)
 * high x 2,564,720 ops/sec ±0.90% (91 runs sampled)
 * multipolygon x 1,457,482 ops/sec ±1.18% (86 runs sampled)
 * polygonWithHole x 2,555,744 ops/sec ±9.96% (72 runs sampled)
 * square x 3,078,300 ops/sec ±1.04% (90 runs sampled)
 */
const suite = new Benchmark.Suite('turf-polygon-tangents');
for (const {name, geojson} of fixtures) {
    const [poly, pt] = geojson.features;
    suite.add(name, () => tangents(pt, poly));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
