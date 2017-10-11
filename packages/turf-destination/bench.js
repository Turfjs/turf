import fs from 'fs';
import Benchmark from 'benchmark';
import destination from './';

var pt1 = [-75.0, 39.0]
var dist = 100;
var bear = 180;

var suite = new Benchmark.Suite('turf-destination');
suite
  .add('turf-destination',() => destination(pt1, dist, bear))
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();