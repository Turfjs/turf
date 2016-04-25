global.tin = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

global.points = JSON.parse(fs.readFileSync(__dirname+'/test/Points.geojson'));

var suite = new Benchmark.Suite('turf-tin');
suite
  .add('turf-tin',function () {
    global.tin(global.points, 'elevation');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
  })
  .run();
