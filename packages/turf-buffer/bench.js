var Benchmark = require('benchmark');
var fixtures = require('geojson-fixtures').all;
var buffer = require('.');

var suite = new Benchmark.Suite('turf-buffer');

Object.keys(fixtures).forEach(function (name) {
    const fixture = fixtures[name];
    suite.add('turf-buffer#' + name, function () { buffer(fixture, 10, 'miles'); });
});

suite
    .on('cycle', function (event) { console.log(String(event.target)); })
    .on('complete', function () {})
    .run();
