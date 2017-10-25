import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import booleanPointOnLine from './';

/**
 * Benchmark Results
 *
 * LineWithOnly1Segment: 0.557ms
 * LineWithOnly1SegmentOnStart: 0.024ms
 * PointOnFirstSegment: 0.023ms
 * PointOnLastSegment: 0.040ms
 * PointOnLineEnd: 0.073ms
 * PointOnLineMidpoint: 0.007ms
 * PointOnLineMidVertice: 0.011ms
 * PointOnLineStart: 0.007ms
 * LineWithOnly1Segment x 14,778,798 ops/sec ±3.14% (82 runs sampled)
 * LineWithOnly1SegmentOnStart x 13,982,962 ops/sec ±3.47% (76 runs sampled)
 * PointOnFirstSegment x 15,369,530 ops/sec ±4.47% (81 runs sampled)
 * PointOnLastSegment x 12,944,744 ops/sec ±1.29% (90 runs sampled)
 * PointOnLineEnd x 13,012,269 ops/sec ±1.52% (89 runs sampled)
 * PointOnLineMidpoint x 17,516,146 ops/sec ±0.57% (93 runs sampled)
 * PointOnLineMidVertice x 17,351,167 ops/sec ±1.69% (92 runs sampled)
 * PointOnLineStart x 14,669,195 ops/sec ±6.96% (78 runs sampled)
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
