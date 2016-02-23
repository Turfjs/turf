var sample = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');
var featurecollection = require('turf-helpers').featureCollection;
var point = require('turf-helpers').point;

var points = featureCollection(
  [point(1,2, {team: 'Red Sox'}), 
  point(2,1, {team: 'Yankees'}), 
  point(3,1, {team: 'Nationals'}), 
  point(2,2, {team: 'Yankees'}), 
  point(2,3, {team: 'Red Sox'}), 
  point(4,2, {team: 'Yankees'})]);

var suite = new Benchmark.Suite('turf-sample');
suite
  .add('turf-sample',function () {
    sample(points, 4);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();