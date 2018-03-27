const Benchmark = require('benchmark');
const spatialWeight = require('.').default;
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');

/**
 * Benchmark Results
 *
 * point: 1.919ms
 * point x 22,881 ops/sec ±0.68% (97 runs sampled)
 */
const suite = new Benchmark.Suite('turf-spatial-weight');


const columbusPath = path.join(__dirname, 'test', 'in', 'point.json');
const columbusJson = load.sync(columbusPath);
const {name} = path.parse(columbusPath);

console.time(name);
spatialWeight(columbusJson);
console.timeEnd(name);

suite.add(name, () => spatialWeight(columbusJson));

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
