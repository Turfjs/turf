var test = require('tape');
var destination = require('@turf/destination');
var inside = require('@turf/inside');
var circle = require('@turf/circle');
var sector = require('./');

test('circle', function (t) {
    var center = {
        type: "Feature",
        geometry: {type: "Point", coordinates: [11.343297958374023, 44.49521964554709]}
    };
    var radius = 5;
    var steps = 10;

    var sector1 = sector(center, radius, 20, 60, steps, 'kilometers');
    var pointOut1 = destination(center, radius / 3, 90, 'kilometers');
    var pointIn1 = destination(center, radius / 3, 45, 'kilometers');
    t.equal(inside(pointIn1, sector1), true, 'point is inside sector1');
    t.equal(inside(pointOut1, sector1), false, 'point is outside sector1');

    var sector2 = sector(center, radius, 90, -135);
    var pointOut2 = destination(center, radius / 3, 45);
    var pointIn2 = destination(center, radius / 3, 135);
    t.equal(inside(pointIn2, sector2), true, 'point is inside sector2');
    t.equal(inside(pointOut2, sector2), false, 'point is outside sector2');

    var sector3 = sector(center, radius, 45, -45);
    var pointOut3 = destination(center, radius / 3, 30);
    var pointIn3a = destination(center, radius / 3, 90);
    var pointIn3b = destination(center, radius / 3, -90);
    t.equal(inside(pointOut3, sector3), false, 'point is outside sector3');
    t.equal(inside(pointIn3a, sector3), true, 'point is inside sector3');
    t.equal(inside(pointIn3b, sector3), true, 'point is inside sector3');

    var sector4 = sector(center, radius, 180, -180);
    t.deepEqual(sector4, circle(center, radius), 'sector4 is null');

    t.end();
});

