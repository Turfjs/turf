var distance = require('./');
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

var suite = new Benchmark.Suite('turf-distance');
suite
  .add('turf-distance',function () {
    distance(pt1, pt2, 'miles');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();