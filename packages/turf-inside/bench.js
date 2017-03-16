var inside = require('./');
var fs = require('fs');
var Benchmark = require('benchmark');
var point = require('@turf/helpers').point;
var polygon = require('@turf/helpers').polygon;

var poly = polygon([[[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]]]);
var ptIn = point([50, 50]);

var ptInPoly = point([-86.72229766845702, 36.20258997094334]);
var ptOutsidePoly = point([-86.75302505493164, 36.23015046460186]);
var multiPolyHole = JSON.parse(fs.readFileSync(__dirname + '/test/multipoly-with-hole.geojson'));

var suite = new Benchmark.Suite('turf-inside');
suite
  .add('simple', function () {
    inside(ptIn, poly);
  })
  .add('multiPolyHole - inside', function () {
    inside(ptInPoly, multiPolyHole);
  })
  .add('multiPolyHole - outside', function () {
    inside(ptOutsidePoly, multiPolyHole);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () { })
  .run();
