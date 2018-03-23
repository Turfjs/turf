import Benchmark from 'benchmark';
import quadratAnalysis from '.';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';

import bbox from '@turf/bbox';
import { randomPoint } from '@turf/random';
import nearestNeighborAnalysis from '../turf-nearest-neighbor-analysis';
/**
 * Benchmark Results
 * quadrat: 1383.768ms
 * nearest: 12259.498ms
 * quadrat x 0.76 ops/sec ±1.24% (6 runs sampled)
 * nearest x 0.08 ops/sec ±0.97% (5 runs sampled)   
 */
const suite = new Benchmark.Suite('turf-quadrat-analysis');


const smallBbox = [-10, -10, 10, 10];
const dataset = randomPoint(10000, { bbox: smallBbox });


var nameQ = 'quadrat';
var nameN = 'nearest'
console.time(nameQ);
quadratAnalysis(dataset, {
    studyBbox: smallBbox,
    confidenceLevel: 20
});
console.timeEnd(nameQ);

console.time(nameN);
nearestNeighborAnalysis(dataset);
console.timeEnd(nameN);

suite.add(nameQ, () => quadratAnalysis(dataset, {
    studyBbox: smallBbox,
    confidenceLevel: 20
}));
suite.add(nameN, () => nearestNeighborAnalysis(dataset));


suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => { })
    .run();
