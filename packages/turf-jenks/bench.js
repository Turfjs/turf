var jenks = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));

var suite = new Benchmark.Suite('turf-jenks');
suite
  .add('turf-jenks',function () {
    jenks(points, 'elevation', 5);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();