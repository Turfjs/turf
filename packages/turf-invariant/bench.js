import Benchmark from 'benchmark';
import * as helpers from '@turf/helpers';
import * as invariant from './';

const point = helpers.point([-75, 40]);
const linestring = helpers.lineString([[-75, 40], [-70, 50]]);
const polygon = helpers.polygon([[[-75, 40], [-80, 50], [-70, 50], [-75, 40]]]);
const featureCollection = helpers.featureCollection([point, point]);

const suite = new Benchmark.Suite('turf-invariant');

/**
 * Benchmark Results
 *
 * getCoord x 49,812,538 ops/sec ±1.00% (87 runs sampled)
 * getCoords.linestring x 61,998,817 ops/sec ±2.05% (83 runs sampled)
 * getCoords.polygon x 65,227,674 ops/sec ±1.30% (86 runs sampled)
 *
 * // BEFORE
 * getCoord x 14,586,933 ops/sec ±0.92% (88 runs sampled)
 * getCoords.linestring x 1,407,538 ops/sec ±0.90% (90 runs sampled)
 * getCoords.polygon x 1,270,899 ops/sec ±2.46% (84 runs sampled)
 * collectionOf x 25,912,969 ops/sec ±1.52% (88 runs sampled)
 */
suite
    // .add('getCoord', () => { invariant.getCoord(point); })
    .add('getCoords.linestring', () => { invariant.getCoords(linestring); })
    .add('getCoords.polygon', () => { invariant.getCoords(polygon); })
    // .add('collectionOf', () => { invariant.collectionOf(featureCollection, 'Point', 'bench'); })
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
