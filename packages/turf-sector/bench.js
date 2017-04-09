var sector = require('./');
var Benchmark = require('benchmark');

var center = {
    type: "Feature",
    geometry: {type: "Point", coordinates: [-75.0, 39.0]}
};
var radius = 5;
var steps = 10;
var bearing1 = 30;
var bearing2 = 90;
var suite = new Benchmark.Suite('turf-sector');

suite
    .add('turf-sector', function () {
        sector(center, radius, bearing1, bearing2, steps, 'kilometers');
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
    })
    .run();
