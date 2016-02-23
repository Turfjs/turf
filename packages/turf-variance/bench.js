var variance = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');
var polygon = require('turf-helpers').polygon
var point = require('turf-helpers').point
var featurecollection = require('turf-helpers').featureCollection

var poly1 = polygon([[[0,0],[10,0],[10,10], [0,10]]]);
var poly2 = polygon([[[10,0],[20,10],[20,20], [20,0]]]);
var polyFC = featurecollection([poly1, poly2]);
var pt1 = point(1,1, {population: 500});
var pt2 = point(1,3, {population: 400});
var pt3 = point(14,2, {population: 600});
var pt4 = point(13,1, {population: 500});
var pt5 = point(19,7, {population: 200}); 
var ptFC = featurecollection([pt1, pt2, pt3, pt4, pt5]);

var suite = new Benchmark.Suite('turf-variance');
suite
  .add('turf-variance',function () {
    variance(polyFC, ptFC, 'population', 'pop_var');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();