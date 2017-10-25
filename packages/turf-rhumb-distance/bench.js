import { point } from '@turf/helpers';
import Benchmark from 'benchmark';
import distance from './';

const pt1 = point([-75.4, 39.4]);
const pt2 = point([-75.534, 39.123]);

/**
 * Benchmark Results
 *
 * turf-rhumb-distance x 1,721,401 ops/sec ±0.86% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-rhumb-distance');
suite
  .add('turf-rhumb-distance', () => distance(pt1, pt2, 'miles'))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
