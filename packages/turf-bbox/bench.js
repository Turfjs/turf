import load from 'load-json-file';
import Benchmark from 'benchmark';
import { lineString } from '@turf/helpers';
import bbox from './';

const line = lineString([[-74, 40], [-78, 42], [-82, 35]]);

/**
 * Benchmark Results
 *
 */
const suite = new Benchmark.Suite('turf-bbox');
suite
    .add('line', () => bbox(line))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
