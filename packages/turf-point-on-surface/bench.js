var centroid = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var fc = JSON.parse(fs.readFileSync(__dirname + '/fixtures/polygons.geojson'));

var suite = new Benchmark.Suite('turf-point-on-surface');
suite
  .add('turf-point-on-surface',function () {
    centroid(fc);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();