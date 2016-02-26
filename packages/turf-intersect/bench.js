var intersect = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var armenia = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/armenia.json'));
var simple = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/Intersect1.json'));
var suite = new Benchmark.Suite('turf-intersect');
suite
  .add('turf-intersect#simple',function () {
    intersect(simple[0], simple[1]);
  })
  .add('turf-intersect#armenia',function () {
    intersect(armenia[0], armenia[1]);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();