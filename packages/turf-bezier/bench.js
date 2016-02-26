var bezier = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var line = JSON.parse(fs.readFileSync(__dirname+'/fixture/bezierIn.geojson'));

var suite = new Benchmark.Suite('turf-bezier');
suite
  .add('turf-bezier',function () {
    bezier(line, 5000, .85);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();