var filter = require('./');
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

var suite = new Benchmark.Suite('turf-filter');
suite
  .add('turf-filter',function () {
    filter(points, 'team', 'Nationals');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();