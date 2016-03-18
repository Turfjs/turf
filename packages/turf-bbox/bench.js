global.bbox = require('./');
global.bbox2 = require('./index-lazy-reduce');
var Benchmark = require('benchmark');
var fs = require('fs');

global.fc = require('./geojson/FeatureCollection');
global.pt  = require('./geojson/Point');
global.line = require('./geojson/LineString');
global.poly = require('./geojson/Polygon');
global.multiLine = require('./geojson/MultiLineString');
global.multiPoly = require('./geojson/MultiPolygon');

var suite = new Benchmark.Suite('turf-bbox');
suite
  .add('turf-bbox#FeatureCollection',function () {
    global.bbox(global.fc);
  })
  .add('turf-bbox2#FeatureCollection',function () {
    global.bbox2(global.fc);
  })
  /*
  .add('turf-bbox#Point',function () {
    global.bbox(global.pt);
  })
  .add('turf-bbox#LineString',function () {
    global.bbox(global.line);
  })
  .add('turf-bbox#Polygon',function () {
    global.bbox(global.poly);
  })
  .add('turf-bbox#MultiLineString',function () {
    global.bbox(global.multiLine);
  })
  .add('turf-bbox#MultiPolygon',function () {
    global.bbox(global.multiPoly);
  })
  */
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
  })
  .run();
