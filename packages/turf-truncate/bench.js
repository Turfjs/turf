var truncate = require('./');
var Benchmark = require('benchmark');

var point = require(__dirname + '/test/in/pointElevation.json');

var suite = new Benchmark.Suite('turf-truncate');
suite
  .add('turf-truncate',function () {
    truncate(point, 6, 2);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
