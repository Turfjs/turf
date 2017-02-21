var inside = require('./');
var Benchmark = require('benchmark');
var point = require('@turf/helpers').point;
var polygon = require('@turf/helpers').polygon;

var poly = polygon([[[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]]]);
var ptIn = point([50, 50]);

var suite = new Benchmark.Suite('turf-inside');
suite
  .add('turf-inside', function () {
    inside(ptIn, poly);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () { })
  .run();
