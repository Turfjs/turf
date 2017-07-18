var overlaps = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var poly0 = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/polygon0.geojson'));
var poly1 = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/polygon1.geojson'));
var poly2 = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/polygon2.geojson'));
var suite = new Benchmark.Suite('turf-overlaps');
suite
  .add('turf-overlaps#polygons-overlap',function () {
    overlaps(poly0, poly1);
  })
  .add('turf-overlaps#polygons-no-overlap',function () {
    overlaps(poly0, poly2);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
