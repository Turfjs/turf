var isobands = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));

var suite = new Benchmark.Suite('turf-isobands');
suite
  .add('turf-isobands',function () {
    isobands(points, 'elevation', 15, [5, 45, 55, 65, 85,  95, 105, 120, 180], false);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();