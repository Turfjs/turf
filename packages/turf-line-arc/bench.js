import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import lineArc from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * line-arc-full-360 x 38,879 ops/sec ±5.53% (78 runs sampled)
 * line-arc-greater-360 x 435,501 ops/sec ±13.18% (66 runs sampled)
 * line-arc1 x 249,765 ops/sec ±6.43% (69 runs sampled)
 * line-arc2 x 92,964 ops/sec ±6.81% (72 runs sampled)
 * line-arc3 x 47,342 ops/sec ±4.41% (74 runs sampled)
 * line-arc4 x 267,112 ops/sec ±5.95% (71 runs sampled)
 * line-arc5 x 35,259 ops/sec ±4.43% (69 runs sampled)
 * line-arc6 x 38,674 ops/sec ±4.86% (75 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-arc');
for (const {name, geojson} of fixtures) {
    const {radius, bearing1, bearing2, steps, units} = geojson.properties;
    suite.add(name, () => lineArc(geojson, radius, bearing1, bearing2, steps, units));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
