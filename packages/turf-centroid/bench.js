var centroid = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var boxFC = JSON.parse(fs.readFileSync(__dirname+'/test/in/box.geojson'));
var blockFC = JSON.parse(fs.readFileSync(__dirname+'/test/in/block.geojson'));

var suite = new Benchmark.Suite('turf-centroid');
suite
  .add('turf-centroid#simple',function () {
    centroid(boxFC);
  })
  .add('turf-centroid#complex',function () {
    centroid(blockFC);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();
