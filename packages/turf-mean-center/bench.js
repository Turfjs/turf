import Benchmark from 'benchmark';
import { randomPoint } from '@turf/random';
import { featureEach } from '@turf/meta';
import meanCenter from '.';

/**
 * Benchmark Results
 *
 * turf-mean-center - 10 points, unweighted x 907,074 ops/sec ±1.57% (91 runs sampled)
 * turf-mean-center - 10 points, weighted x 2,043,702 ops/sec ±2.12% (89 runs sampled)
 * turf-mean-center - 50 points, unweighted x 202,625 ops/sec ±1.20% (89 runs sampled)
 * turf-mean-center - 50 points, weighted x 494,910 ops/sec ±0.71% (90 runs sampled)
 * turf-mean-center - 250 points, unweighted x 40,215 ops/sec ±1.72% (88 runs sampled)
 * turf-mean-center - 250 points, weighted x 99,468 ops/sec ±0.81% (88 runs sampled)
 */
var suite = new Benchmark.Suite('turf-mean-center');
var points = [randomPoint(10), randomPoint(50), randomPoint(250)];
points.forEach(function(collection){
  featureEach(collection, function(point){
    point.properties.weight = Math.floor(Math.random() * 20) + 1;
  });
});

suite
    .add('turf-mean-center - 10 points, unweighted', () => meanCenter(points[0]))
    .add('turf-mean-center - 10 points, weighted', () => meanCenter(points[0], 'weight'))
    .add('turf-mean-center - 50 points, unweighted', () => meanCenter(points[1]))
    .add('turf-mean-center - 50 points, weighted', () => meanCenter(points[1], 'weight'))
    .add('turf-mean-center - 250 points, unweighted', () => meanCenter(points[2]))
    .add('turf-mean-center - 250 points, weighted', () => meanCenter(points[2], 'weight'))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
