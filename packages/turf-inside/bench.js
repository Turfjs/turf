var inside = require('./');
var fs = require('fs');
var Benchmark = require('benchmark');
var point = require('@turf/helpers').point;
var polygon = require('@turf/helpers').polygon;

var poly = polygon([[[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]]]);
var ptIn = point([50, 50]);

var ptInPoly = point([-86.7222, 36.2025]);
var ptOutsidePoly = point([-110, 40]);
var multiPolyHole = JSON.parse(fs.readFileSync(__dirname + '/test/in/multipoly-with-hole.geojson'));

/**
 * Benchmark Results
 *
 * simple x 3,185,225 ops/sec ±0.99% (90 runs sampled)
 * multiPolyHole - inside x 1,234,815 ops/sec ±0.90% (90 runs sampled)
 * multiPolyHole - outside x 1,644,657 ops/sec ±1.26% (88 runs sampled)
 */
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
