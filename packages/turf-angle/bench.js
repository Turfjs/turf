import path from 'path';
import Benchmark from 'benchmark';
import angle from '.';

/**
 * Benchmark Results
 *
 * angle x 980,468 ops/sec ±1.30% (84 runs sampled)
 * angle -- meractor x 931,748 ops/sec ±1.27% (88 runs sampled)
 */
const suite = new Benchmark.Suite('turf-angle')
    .add('angle', () => angle([5, 5], [5, 6], [3, 4]))
    .add('angle -- meractor', () => angle([5, 5], [5, 6], [3, 4], {mercator: true}))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
