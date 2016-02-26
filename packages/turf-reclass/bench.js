var reclass = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var inField = 'elevation';
var outField = 'heightIndex';
var translations = [[0, 20, 1], [20, 40, 2], [40, 60 , 3], [60, Infinity, 4]];
var points = JSON.parse(fs.readFileSync(__dirname+'/geojson/Points.geojson'));

var suite = new Benchmark.Suite('turf-reclass');
suite
  .add('turf-reclass',function () {
    reclass(points, inField, outField, translations);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();