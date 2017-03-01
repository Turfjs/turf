var Benchmark = require('benchmark');
// var lineIntersect = require('.');

var suite = new Benchmark.Suite('turf-line-intersect');
suite
  .add('line-intersect', function () { })
  .on('cycle', function (event) { console.log(String(event.target)); })
  .on('complete', function () { })
  .run();
