import path from 'path';
import glob from 'glob';
import Benchmark from 'benchmark';
import load from 'load-json-file';
import crosses from './';

/**
 * Benchmark Results
 *
 * LineDoesNotCrossButTouches: 3.012ms
 * LineDoesNotCrossLine: 0.170ms
 * LineDoesNotCrossPolygon: 0.644ms
 * MultiPointNotCrossLine: 0.135ms
 * MultiPointNotCrossLineEnd: 0.031ms
 * LineCrossesLine: 0.321ms
 * LineCrossesPolygon: 0.405ms
 * LineCrossesPolygonPartial: 0.408ms
 * MultiPointsCrossLine: 0.026ms
 * LineDoesNotCrossButTouches x 71,945 ops/sec ±2.04% (71 runs sampled)
 * LineDoesNotCrossLine x 88,084 ops/sec ±2.56% (70 runs sampled)
 * LineDoesNotCrossPolygon x 86,024 ops/sec ±2.80% (71 runs sampled)
 * MultiPointNotCrossLine x 11,976,750 ops/sec ±1.61% (93 runs sampled)
 * MultiPointNotCrossLineEnd x 10,191,949 ops/sec ±3.51% (85 runs sampled)
 * LineCrossesLine x 68,764 ops/sec ±2.53% (72 runs sampled)
 * LineCrossesPolygon x 49,268 ops/sec ±2.70% (80 runs sampled)
 * LineCrossesPolygonPartial x 63,313 ops/sec ±2.87% (71 runs sampled)
 * MultiPointsCrossLine x 10,900,034 ops/sec ±0.39% (93 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-crosses');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;

    console.time(name);
    crosses(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => crosses(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
