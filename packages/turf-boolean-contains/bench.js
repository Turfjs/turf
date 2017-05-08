const path = require('path');
const glob = require('glob');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const bbox = require('@turf/bbox');
const contains = require('./');

/**
 * Benchmark Results
 *
 * false-polygon-overlap x 110,681 ops/sec ±1.35% (89 runs sampled)
 * false-polygons1 x 5,008,431 ops/sec ±5.25% (83 runs sampled)
 * false-polygons2 x 4,958,640 ops/sec ±5.64% (82 runs sampled)
 * true-polygons1 x 235,353 ops/sec ±1.27% (90 runs sampled)
 * true-polygons2 x 170,512 ops/sec ±1.24% (91 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-contains');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    feature1.bbox = bbox(feature1);
    feature2.bbox = bbox(feature2);
    suite.add(name, () => contains(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
