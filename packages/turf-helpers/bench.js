import Benchmark from 'benchmark';
import { point, lineString, polygon, multiPoint, multiLineString, multiPolygon, featureCollection, geometryCollection, round } from './';

/**
 * Benchmark Results
 *
 * round x 54,405,175 ops/sec ±2.03% (89 runs sampled)
 * point x 25,384,060 ops/sec ±2.29% (85 runs sampled)
 * lineString x 16,548,474 ops/sec ±1.84% (86 runs sampled)
 * polygon x 12,348,826 ops/sec ±2.02% (85 runs sampled)
 * multiPoint x 17,150,485 ops/sec ±1.76% (86 runs sampled)
 * multiLineString x 11,328,369 ops/sec ±2.82% (79 runs sampled)
 * multiPolygon x 1,284,305 ops/sec ±1.22% (89 runs sampled)
 * featureCollection x 10,847,952 ops/sec ±1.95% (82 runs sampled)
 * geometryCollection x 14,392,524 ops/sec ±2.06% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-helpers');
suite
    .add('point', () => point([5, 10]))
    .add('round', () => round(120.123))
    .add('lineString', () => lineString([[5, 10], [20, 40]]))
    .add('polygon', () => polygon([[[5, 10], [20, 40], [40, 0], [5, 10]]]))
    .add('multiPoint', () => multiPoint([[0, 0], [10, 10]]))
    .add('multiLineString', () => multiLineString([[[0, 0], [10, 10]], [[5, 0], [15, 8]]]))
    .add('multiPolygon', () => multiPolygon([[[[94, 57], [78, 49], [94, 43], [94, 57]]], [[[93, 19], [63, 7], [79, 0], [93, 19]]]]))
    .add('featureCollection', () => featureCollection([point([5, 10]), point([5, 10])]))
    .add('geometryCollection', () => geometryCollection([{type: 'Point', coordinates: [100, 0]}, {type: 'Point', coordinates: [100, 0]}]))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
