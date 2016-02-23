var bearing = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var pt1 = {
    "type": "Feature",
    "geometry": {"type": "Point", "coordinates": [-75.4, 39.4]}
  };
var pt2 = {
    "type": "Feature",
    "geometry": {"type": "Point", "coordinates": [-75.534, 39.123]}
  };

var suite = new Benchmark.Suite('turf-bearing');
suite
  .add('turf-bearing',function () {
    bearing(pt1, pt2);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();