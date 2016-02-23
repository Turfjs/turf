global.explode = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');
var polygon = require('turf-helpers').polygon;
var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;

global.poly = polygon([[[0,0], [0,10], [10,10] , [10,0]]]);
var p1 = point(0,0),
  p2 = point(0,10),
  p3 = point(10,10),
  p4 = point(10,0);
var fc = featurecollection([p1,p2,p3,p4]);

var suite = new Benchmark.Suite('turf-explode');
suite
  .add('turf-explode',function () {
    global.explode(global.poly);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();
