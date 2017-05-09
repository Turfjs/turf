var destination = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var pt1 = {
    type: "Feature",
    geometry: {type: "Point", coordinates: [-75.0, 39.0]}
  };
var dist = 100;
var bear = 180;

/**
 * Benchmark Results
 *
 */
var suite = new Benchmark.Suite('turf-rhumb-destination');
suite
  .add('turf-rhumb-destination',function () {
    destination(pt1, dist, bear, 'kilometers');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();