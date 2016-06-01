var midpoint = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');
var point = require('turf-helpers').point;

var pt1 = point([0,0]);
var pt2 = point([10,0]);

new Benchmark.Suite('turf-midpoint')
.add('turf-midpoint',function () {
  midpoint(pt1, pt2);
})
.on('cycle', function (event) {
  console.log(String(event.target));
})
.run();