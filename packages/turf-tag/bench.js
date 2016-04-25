var tag = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var points = JSON.parse(fs.readFileSync('./test/tagPoints.geojson'));
var polygons = JSON.parse(fs.readFileSync('./test/tagPolygons.geojson'));

var suite = new Benchmark.Suite('turf-tag');
suite
  .add('turf-tag',function () {
    tag(points, polygons, 'polyID', 'containingPolyID');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();
