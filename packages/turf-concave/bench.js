var concave = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var pts1 = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/pts1.geojson'));
var pts2 = JSON.parse(fs.readFileSync(__dirname+'/fixtures/in/pts2.geojson'));
    
var suite = new Benchmark.Suite('turf-concave');
suite
  .add('turf-concave#simple',function () {
  	concave(pts1, 2.5, 'miles');
  })
  .add('turf-concave#complex',function () {
  	concave(pts2, 2.5, 'miles');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();
