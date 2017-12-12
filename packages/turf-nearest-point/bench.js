import fs from 'fs';
import path from 'path';
import Benchmark from 'benchmark';
import { point } from '@turf/helpers';
import nearestPoint from './';

var pts = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'in', 'points.json')));

/**
 * Benchmark Results
 *
 * turf-nearest-point x 72,623 ops/sec ±9.23% (73 runs sampled)
 */
var suite = new Benchmark.Suite('turf-nearest-point');
suite
    .add('turf-nearest-point', () => nearestPoint(point(pts.properties.targetPoint), pts))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
