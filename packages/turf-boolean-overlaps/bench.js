const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const overlaps = require('./');
const Benchmark = require('benchmark');

/**
 * Benchmark Results
 *
 * lines: 0.822ms
 * polygons: 0.354ms
 * lines: 0.599ms
 * lines2: 0.029ms
 * polygons: 0.062ms
 * polygons2: 0.037ms
 * lines x 159,745 ops/sec ±2.78% (78 runs sampled)
 * polygons x 129,087 ops/sec ±2.40% (78 runs sampled)
 * lines x 245,938 ops/sec ±2.26% (78 runs sampled)
 * lines2 x 684,221 ops/sec ±2.07% (79 runs sampled)
 * polygons x 242,569 ops/sec ±2.53% (77 runs sampled)
 * polygons2 x 364,308 ops/sec ±4.93% (68 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-disjoint');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    overlaps(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => overlaps(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
