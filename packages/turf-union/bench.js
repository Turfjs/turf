var union = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var fcs = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/Intersect1.geojson'));

var suite = new Benchmark.Suite('turf-union');
suite
  .add('turf-union',function () {
    union(fcs[0].features[0], fcs[1].features[0]);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
