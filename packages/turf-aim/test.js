var test = require('tape');
var point = require('turf-helpers').point;
var distance = require('turf-distance');
var aim = require('./');

test('aim', function (t) {
    var target = point([30, 41]);
    var projectile = point([29, 40]);
    var t_velocity = 10;
    var p_velocity = 50;
    var t_bearing = 60;
    var units = 'kilometers';

    var impact = aim(target, projectile, t_velocity, p_velocity, t_bearing, units);

    var t_time = distance(target, impact) / t_velocity;
    var p_time = distance(projectile, impact) / p_velocity;

    t.equal(t_time < p_time * 1.005 && t_time > p_time * 0.995, true, 'should arrive at similar time');
    t.end();
});
