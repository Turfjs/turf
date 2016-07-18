var centerOfMass = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var fc = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/elevation1.geojson'));
var suite = new Benchmark.Suite('turf-center-of-mass');
suite
  .add('turf-center-of-mass',function () {
    centerOfMass(fc.features[0]);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
