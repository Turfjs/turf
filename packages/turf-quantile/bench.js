var quantile = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));

var suite = new Benchmark.Suite('turf-quantile');
suite
  .add('turf-quantile',function () {
    quantile(points, 'elevation', [10,30,40,60,80,90,99]);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();