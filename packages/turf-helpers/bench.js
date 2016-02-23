var point = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var suite = new Benchmark.Suite('turf-point');
suite
  .add('turf-point',function () {
    point(5, 10, {name: 'test point'});
  })
  .add('turf-point#array',function () {
    point(5, 10, {name: 'test point'});
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();