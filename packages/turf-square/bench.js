import fs from 'fs';
import Benchmark from 'benchmark';
import square from './dist/js/index.js';

var bbox = [0,0,5,10];

var suite = new Benchmark.Suite('turf-square');
suite
  .add('turf-square',function () {
    square(bbox);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();