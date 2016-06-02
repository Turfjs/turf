var circle = require('./');
var Benchmark = require('benchmark');

var center = {
    type: "Feature",
    geometry: {type: "Point", coordinates: [-75.0, 39.0]}
};
var radius = 5;
var steps = 10;

var suite = new Benchmark.Suite('turf-circle');

suite
    .add('turf-circle',function () {
        circle(center, radius, steps, 'kilometers');
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {})
    .run();
