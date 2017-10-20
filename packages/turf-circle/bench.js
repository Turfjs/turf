import Benchmark from 'benchmark';
import circle from './';

const center = [-75.0, 39.0];
const radius = 5;

/**
 * Benchmark Results
 *
 * turf-circle - 16 steps x 140,793 ops/sec ±5.92% (79 runs sampled)
 * turf-circle - 32 steps x 84,428 ops/sec ±2.28% (86 runs sampled)
 * turf-circle - 64 steps x 45,202 ops/sec ±1.85% (88 runs sampled)
 */
const suite = new Benchmark.Suite('turf-circle');
suite
    .add('turf-circle - 16 steps', () => circle(center, radius, 16))
    .add('turf-circle - 32 steps', () => circle(center, radius, 32))
    .add('turf-circle - 64 steps', () => circle(center, radius, 64))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
