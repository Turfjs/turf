var Benchmark = require('benchmark');
var point = require('turf-helpers').point;
var aim = require('./');

var target = point([30, 41]);
var projectile = point([29, 40]);
var t_velocity = 10;
var p_velocity = 50;
var t_bearing = 60;
var units = 'kilometers';

var suite = new Benchmark.Suite('turf-aim');

suite
    .add('turf-sample',function () {
        aim(target, projectile, t_velocity, p_velocity, t_bearing, units);
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {})
    .run();