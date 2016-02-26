var flip = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');
var point = require('turf-helpers').point;
var linestring = require('turf-helpers').lineString;
var polygon = require('turf-helpers').polygon;
var featurecollection = require('turf-helpers').featureCollection;

var pt = point(1,0);
var line = linestring([[1,0], [1,0]]);
var poly = polygon([[[1,0], [1,0], [1,2]], [[.2,.2], [.3,.3],[.1,.2]]]);
var pt1 = point(1,0);
var pt2 = point(1,0);
var fc = featurecollection([pt1, pt2]);

var suite = new Benchmark.Suite('turf-flip');
suite
  .add('turf-flip#Point',function () {
    flip(pt);
  })
  .add('turf-flip#LineString',function () {
    flip(line);
  })
  .add('turf-flip#Polygon',function () {
    flip(poly);
  })
  .add('turf-flip#FeatureCollection',function () {
    flip(fc);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();