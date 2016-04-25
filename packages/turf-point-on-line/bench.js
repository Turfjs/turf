var pointOnLine = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');
var point = require('turf-helpers').point;

var route1 = JSON.parse(fs.readFileSync(__dirname + '/test/in/route1.geojson'));
var route2 = JSON.parse(fs.readFileSync(__dirname + '/test/in/route2.geojson'));
var line1 = JSON.parse(fs.readFileSync(__dirname + '/test/in/line1.geojson'));

var pt1 = point([-97.79617309570312,22.254624939561698]);
var pt2 = point([-79.0850830078125,37.60117623656667]);
var pt3 = point([-112.60660171508789,45.96021963947196]);

var suite = new Benchmark.Suite('turf-point-on-line');
suite
  .add('turf-point-on-line#simple',function () {
      pointOnLine(line1, pt1);
  })
  .add('turf-point-on-line#route1',function () {
      pointOnLine(route1, pt2);
  })
  .add('turf-point-on-line#route2',function () {
      pointOnLine(route2, pt3);
  })
  .on('cycle', function (event) {
      console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();
