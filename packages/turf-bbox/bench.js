global.bbox = require('./');
global.bbox2 = require('./index-lazy-reduce');
var Benchmark = require('benchmark');
var fs = require('fs');

global.fc = require('./test/FeatureCollection');
global.pt  = require('./test/Point');
global.line = require('./test/LineString');
global.poly = require('./test/Polygon');
global.multiLine = require('./test/MultiLineString');
global.multiPoly = require('./test/MultiPolygon');

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
