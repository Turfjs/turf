var bboxpolygon = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var suite = new Benchmark.Suite('turf-bbox-polygon');
suite
  .add('turf-bbox-polygon',function () {
    bboxpolygon([0,0,10,10])
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();