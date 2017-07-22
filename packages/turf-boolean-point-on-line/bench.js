const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const booleanPointOnLine = require('./');

/**
 * Benchmark Results
 *
 * PointOnLineEnd: 0.355ms
 * PointOnLineMidpoint: 0.019ms
 * PointOnLineStart: 0.021ms
 * PointOnLineEnd x 13,957,263 ops/sec ±0.53% (91 runs sampled)
 * PointOnLineMidpoint x 17,388,052 ops/sec ±0.46% (94 runs sampled)
 * PointOnLineStart x 17,036,405 ops/sec ±1.34% (91 runs sampled)
 */
const suite = new Benchmark.Suite('turf-booleanPointOnLine');
glob.sync(path.join(__dirname, 'test', 'true', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    booleanPointOnLine(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => booleanPointOnLine(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
