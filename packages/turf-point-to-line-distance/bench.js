const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const pointToLineDistance = require('./');

/**
 * Benchmark Results
 *
 * <Place results here>
 */
const suite = new Benchmark.Suite('turf-point-to-line-distance');
glob.sync(path.join(__dirname, 'test', 'in', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    pointToLineDistance(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => pointToLineDistance(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
