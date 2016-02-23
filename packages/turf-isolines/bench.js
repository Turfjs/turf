var isolines = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));

var suite = new Benchmark.Suite('turf-isolines');
suite
  .add('turf-isolines',function () {
    isolines(points, 'elevation', 15, [25, 45, 55, 65, 85,  95, 105, 120, 180]);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();