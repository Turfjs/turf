var center = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var boxFC = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/box.geojson'));
var blockFC = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/block.geojson'));

var suite = new Benchmark.Suite('turf-center');
suite
  .add('turf-center#simple',function () {
    center(boxFC);
  })
  .add('turf-center#complex',function () {
    center(blockFC);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();