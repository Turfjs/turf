import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import disjoint from './';

/**
 * Benchmark Results
 *
 * LineIsNotDisjointFromLine: 3.464ms
 * LineIsNotDisjointFromPolygon: 1.199ms
 * MultiPointNotDisjointFromLine: 0.213ms
 * MultiPointNotDisjointFromMultipoint: 0.193ms
 * MultiPointNotDisjointFromPoly: 1.468ms
 * PointIsNotDisjointFromLineString: 0.184ms
 * PointNotDisjointFromInternalPoly: 0.651ms
 * PointNotDisjointFromMultipoint: 0.165ms
 * PointNotDisjointFromPoint: 0.020ms
 * PointNotDisjointFromPoly: 0.025ms
 * PolyIsNotDisjointFromPoly: 0.209ms
 * LineIsDisjointFromLine: 0.280ms
 * LineIsDisjointFromPolygon: 0.230ms
 * MultiPointDisjointFromLine: 0.046ms
 * MultiPointDisjointFromMultipoint: 0.015ms
 * MultiPointIsDisjointFromPoly: 0.034ms
 * PointDisjointFromMultipoint: 0.155ms
 * PointDisjointFromPoint: 0.021ms
 * PointIsDisjointFromLinestring: 0.962ms
 * PointIsDisjointFromPoly: 0.131ms
 * PolyIsDisjointFromPoly: 0.080ms
 * LineIsNotDisjointFromLine x 50,655 ops/sec ±3.66% (63 runs sampled)
 * LineIsNotDisjointFromPolygon x 49,947 ops/sec ±2.79% (42 runs sampled)
 * MultiPointNotDisjointFromLine x 7,431,677 ops/sec ±1.24% (85 runs sampled)
 * MultiPointNotDisjointFromMultipoint x 7,399,444 ops/sec ±0.99% (87 runs sampled)
 * MultiPointNotDisjointFromPoly x 2,298,298 ops/sec ±1.02% (88 runs sampled)
 * PointIsNotDisjointFromLineString x 10,068,082 ops/sec ±1.02% (89 runs sampled)
 * PointNotDisjointFromInternalPoly x 2,136,512 ops/sec ±1.24% (87 runs sampled)
 * PointNotDisjointFromMultipoint x 10,712,566 ops/sec ±0.98% (88 runs sampled)
 * PointNotDisjointFromPoint x 16,663,034 ops/sec ±0.98% (88 runs sampled)
 * PointNotDisjointFromPoly x 2,509,098 ops/sec ±1.06% (87 runs sampled)
 * PolyIsNotDisjointFromPoly x 2,078,010 ops/sec ±1.60% (85 runs sampled)
 * LineIsDisjointFromLine x 62,985 ops/sec ±4.13% (64 runs sampled)
 * LineIsDisjointFromPolygon x 58,937 ops/sec ±2.84% (62 runs sampled)
 * MultiPointDisjointFromLine x 4,634,718 ops/sec ±1.94% (85 runs sampled)
 * MultiPointDisjointFromMultipoint x 6,602,132 ops/sec ±3.76% (81 runs sampled)
 * MultiPointIsDisjointFromPoly x 1,203,406 ops/sec ±1.01% (87 runs sampled)
 * PointDisjointFromMultipoint x 11,373,917 ops/sec ±1.33% (87 runs sampled)
 * PointDisjointFromPoint x 18,149,666 ops/sec ±1.10% (85 runs sampled)
 * PointIsDisjointFromLinestring x 7,572,815 ops/sec ±0.97% (89 runs sampled)
 * PointIsDisjointFromPoly x 2,217,658 ops/sec ±1.04% (83 runs sampled)
 * PolyIsDisjointFromPoly x 551,254 ops/sec ±1.18% (90 runs sampled)
 */
const suite = new Benchmark.Suite('turf-boolean-disjoint');
glob.sync(path.join(__dirname, 'test', '**', '*.geojson')).forEach(filepath => {
    const {name} = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1, feature2] = geojson.features;
    console.time(name);
    disjoint(feature1, feature2);
    console.timeEnd(name);
    suite.add(name, () => disjoint(feature1, feature2));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
