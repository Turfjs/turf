import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import overlap from './';

/**
 * Benchmark Results
 *
 * equal-linear-rings: 1.286ms
 * equal-lines: 0.573ms
 * equal-multipoints: 0.823ms
 * equal-polygons: 0.312ms
 * linear-rings: 8.417ms
 * lines: 0.939ms
 * multipoints: 0.471ms
 * polygon-with-hole-polygon: 0.827ms
 * polygons: 0.306ms
 * linear-rings: 2.558ms
 * lines: 3.282ms
 * multipoints: 0.058ms
 * polygon-with-hole-polygon: 1.105ms
 * polygons: 0.067ms
 * simple-lines: 1.083ms
 * single-multipoints: 0.041ms
 * equal-linear-rings x 86,843 ops/sec ±4.89% (78 runs sampled)
 * equal-lines x 75,485 ops/sec ±9.21% (75 runs sampled)
 * equal-multipoints x 33,422 ops/sec ±2.26% (77 runs sampled)
 * equal-polygons x 71,869 ops/sec ±1.76% (84 runs sampled)
 * linear-rings x 5,006 ops/sec ±4.26% (73 runs sampled)
 * lines x 7,781 ops/sec ±3.84% (75 runs sampled)
 * multipoints x 287,008 ops/sec ±1.61% (77 runs sampled)
 * polygon-with-hole-polygon x 43,735 ops/sec ±1.83% (83 runs sampled)
 * polygons x 91,882 ops/sec ±1.55% (81 runs sampled)
 * linear-rings x 4,008 ops/sec ±3.07% (72 runs sampled)
 * lines x 5,632 ops/sec ±4.55% (71 runs sampled)
 * multipoints x 271,445 ops/sec ±3.77% (75 runs sampled)
 * polygon-with-hole-polygon x 41,716 ops/sec ±1.67% (82 runs sampled)
 * polygons x 81,217 ops/sec ±2.46% (81 runs sampled)
 * simple-lines x 8,880 ops/sec ±3.63% (75 runs sampled)
 * single-multipoints x 281,914 ops/sec ±2.27% (76 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-overlap');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    overlap(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => overlap(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
