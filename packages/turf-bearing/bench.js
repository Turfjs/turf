var Benchmark = require('benchmark');
var point = require('@turf/helpers').point;
var bearing = require('./');

var start = point([-75.4, 39.4]);
var end = point([-75.534, 39.123]);

var suite = new Benchmark.Suite('turf-bearing');
suite
    .add('initial bearing', () => { bearing(start, end); })
    .add('final bearing', () => { bearing(start, end, true); })
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
