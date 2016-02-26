var size = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var bbox = [0, 0, 10, 10];
var suite = new Benchmark.Suite('turf-size');
suite
  .add('turf-size#grow',function () {
    size(bbox, 2);
  })
  .add('turf-size#shrink',function () {
    size(bbox, .5);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();