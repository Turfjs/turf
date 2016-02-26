global.count = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');
global.polygon = require('turf-helpers').polygon;
global.point = require('turf-helpers').point;
global.featurecollection = require('turf-featurecollection');

global.poly1 = polygon([[[0,0],[10,0],[10,10], [0,10]]]);
global.poly2 = polygon([[[10,0],[20,10],[20,20], [20,0]]]);
global.polyFC = featurecollection([poly1, poly2]);
global.pt1 = point(5,5, {population: 200});
global.pt2 = point(1,3, {population: 600});
global.pt3 = point(14,2, {population: 100});
global.pt4 = point(13,1, {population: 200});
global.pt5 = point(19,7, {population: 300});
global.ptFC = featurecollection([pt1, pt2, pt3, pt4, pt5]);

var suite = new Benchmark.Suite('turf-count');
suite
  .add('turf-count',function () {
    global.count(global.polyFC, global.ptFC, 'pt_count');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();
