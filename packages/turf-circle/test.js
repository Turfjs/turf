var test = require('tape');
var destination = require('turf-destination');
var inside = require('turf-inside');
var circle = require('./');

test('circle', function(t){
    var center = {
        type: "Feature",
        geometry: {type: "Point", coordinates: [-75.343, 39.984]}
    };
    var radius = 5;
    var steps = 10;

    var polygon = circle(center, radius, steps, 'kilometers');
    var point1 = destination(center, radius - 1, 45, 'kilometers');
    var point2 = destination(center, radius + 1, 135, 'kilometers');

    t.equal(inside(point1, polygon), true, 'point is inside the polygon');
    t.equal(inside(point2, polygon), false, 'point is outside the polygon');
    t.end();
});
