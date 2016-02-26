var difference = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var clip = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/differencedHole.geojson'));
var hole = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/differencedFC.geojson'));

var suite = new Benchmark.Suite('turf-difference');
suite
  .add('turf-difference#clip',function () {
    difference(clip[0], clip[1]);
  })
  .add('turf-difference#hole',function () {
    difference(hole[0], hole[1]);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();