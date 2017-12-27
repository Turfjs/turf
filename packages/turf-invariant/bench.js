import Benchmark from 'benchmark';
import * as helpers from '@turf/helpers';
import * as invariant from './';

const pt = helpers.point([-75, 40]);
const line = helpers.lineString([[-75, 40], [-70, 50]]);
const poly = helpers.polygon([[[-75, 40], [-80, 50], [-70, 50], [-75, 40]]]);
const fc = helpers.points([
    [-75, 40],
    [20, 50]
]);

const suite = new Benchmark.Suite('turf-invariant');

/**
 * Benchmark Results
 *
 * getCoord -- pt x 60,659,161 ops/sec ±1.34% (89 runs sampled)
 * getCoords -- line x 63,252,327 ops/sec ±1.19% (81 runs sampled)
 * getCoords -- poly x 62,053,169 ops/sec ±1.49% (85 runs sampled)
 * collectionOf -- fc x 24,204,462 ops/sec ±2.00% (81 runs sampled)
 * getType -- pt x 59,544,117 ops/sec ±1.14% (87 runs sampled)
 * firstCoord -- pt x 35,617,486 ops/sec ±4.23% (84 runs sampled)
 * firstCoord -- line x 36,603,206 ops/sec ±1.27% (89 runs sampled)
 * firstCoord -- poly x 32,458,532 ops/sec ±1.29% (89 runs sampled)
 * lastCoord -- pt x 30,825,645 ops/sec ±1.68% (85 runs sampled)
 * lastCoord -- line x 30,191,980 ops/sec ±1.22% (87 runs sampled)
 * lastCoord -- poly x 26,787,025 ops/sec ±1.65% (86 runs sampled)
 */
suite
    .add('getCoord -- pt', () => invariant.getCoord(pt))
    .add('getCoords -- line', () => invariant.getCoords(line))
    .add('getCoords -- poly', () => invariant.getCoords(poly))
    .add('collectionOf -- fc', () => invariant.collectionOf(fc, 'Point', 'bench'))
    .add('getType -- pt', () => invariant.getType(pt))
    .add('firstCoord -- pt', () => invariant.firstCoord(pt))
    .add('firstCoord -- line', () => invariant.firstCoord(line))
    .add('firstCoord -- poly', () => invariant.firstCoord(poly))
    .add('lastCoord -- pt', () => invariant.lastCoord(pt))
    .add('lastCoord -- line', () => invariant.lastCoord(line))
    .add('lastCoord -- poly', () => invariant.lastCoord(poly))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
