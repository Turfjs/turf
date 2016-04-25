var lineSlice = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');
var point = require('turf-helpers').point;

var route1 = JSON.parse(fs.readFileSync(__dirname + '/test/in/route1.geojson'));
var route2 = JSON.parse(fs.readFileSync(__dirname + '/test/in/route2.geojson'));
var line1 = JSON.parse(fs.readFileSync(__dirname + '/test/in/line1.geojson'));

var start1 = point([-97.79617309570312,22.254624939561698]);
var stop1 = point([-97.72750854492188,22.057641623615734]);
var start2 = point([-79.0850830078125,37.60117623656667]);
var stop2 = point([-77.7667236328125,38.65119833229951]);
var start3 = point([-112.60660171508789,45.96021963947196]);
var stop3 = point([-111.97265625,48.84302835299516]);

var suite = new Benchmark.Suite('turf-line-slice');
suite
  .add('turf-line-slice#simple',function () {
    lineSlice(start1, stop1, line1);
  })
  .add('turf-line-slice#route1',function () {
    lineSlice(start2, stop2, route1);
  })
  .add('turf-line-slice#route2',function () {
    lineSlice(start3, stop3, route2);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();
