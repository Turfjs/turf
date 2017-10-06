import fs from 'fs';
import Benchmark from 'benchmark';
import convex from './';

var fc = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/elevation1.geojson'));
var suite = new Benchmark.Suite('turf-convex');
suite
  .add('turf-convex',function () {
    convex(fc);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();