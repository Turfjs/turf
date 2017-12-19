import path from 'path';
import Benchmark from 'benchmark';
import angle from '.';

/**
 * Benchmark Results
 *
 * angle x 2,563,610 ops/sec ±1.03% (87 runs sampled)
 */
const suite = new Benchmark.Suite('turf-angle')
    .add('angle', () => angle([5, 5], [5, 6], [3, 4]))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
