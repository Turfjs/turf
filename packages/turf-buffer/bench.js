var buffer = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var pt = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/Point.geojson'));
var line = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/LineString.geojson'));
var polygon = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/Polygon.geojson'));
var fc = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/FeatureCollection.geojson'));

var suite = new Benchmark.Suite('turf-buffer');
suite
  .add('turf-buffer#Point',function () {
    buffer(pt, 10, 'miles');
  })
  .add('turf-buffer#LineString',function () {
    buffer(line, 10, 'miles');
  })
  .add('turf-buffer#Polygon',function () {
    buffer(polygon, 10, 'miles');
  })
  .add('turf-buffer#FeatureCollection',function () {
    buffer(fc, 10, 'miles');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();