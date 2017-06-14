var isClockwise = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var clockwiseRing = [[0,0],[1,1],[1,0],[0,0]];
var counterClockwiseRing = [[0,0],[1,0],[1,1],[0,0]];

var suite = new Benchmark.Suite('turf-is-clockwise');
suite
  .add('turf-is-clockwise##clockwise',function () {
    isClockwise(clockwiseRing);
  })
  .add('turf-is-clockwise#counterclockwise',function () {
    isClockwise(counterClockwiseRing);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();