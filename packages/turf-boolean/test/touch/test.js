var test = require('tape');
var helpers = require('@turf/helpers');
var touch = require('../../touch.js');

test('turf-boolean-touch', function (t) {
    
    var pt1 = helpers.point([1, 1]);
    var pt2 = helpers.point([1, 4]);
    var line1 = helpers.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    var pointOnMiddleOfLine = helpers.point([1, 2]);
    var pointNotOnLine = helpers.point([12, 12]);
    
    t.equal(touch(pt1, line1), true, 'point on start vertice touches linestring');
    t.equal(touch(pt2, line1), true, 'point on end vertice touches linestring');
    t.equal(touch(pointOnMiddleOfLine, line1), false, 'point in the middle of vertices does not touch linestring');
    t.equal(touch(pointNotOnLine, line1), false, 'point far away does not touch linestring');

    var mp1 = helpers.multiPoint([[1, 1], [12, 12]]);
    var mp2 = helpers.multiPoint([[1, 1], [1, 1.5]]);
    var mp3 = helpers.multiPoint([[1, 1], [1, 4]]);

    t.equal(touch(mp1, line1), true, 'Single multipoint on end of line returns true');
    t.equal(touch(mp2, line1), false, 'Multiple points on line returns false');
    t.equal(touch(mp3, line1), false, 'Points on start and end of line returns false');

    var poly1 = helpers.polygon([[[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]]);
    
    t.equal(touch(pt1, poly1), true, 'A point lies on the polygon boundary');
    t.equal(touch(pointNotOnLine, poly1), false, 'A point does not lie on the polygon boundary');

    t.equal(touch(mp1, poly1), true, 'A multipoint lies on the polygon boundary');
    t.equal(touch(mp2, poly1), false, 'Multiple points that lie on the polygon boundary returns false');
    t.equal(touch(mp3, poly1), false, 'A point from a Multipoint that falls inside the polygon boundary returns false');

    // var multiline1 = helpers.multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    // var multiline2 = helpers.multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    // var multiline3 = helpers.multiLineString([[[2, 1], [2, 2], [2, 3], [2, 4]], [[3, 1], [3, 2], [3, 3], [3, 4]]]);

    // t.equal(equal(multiline1, multiline2), true, 'MultiLines are equal');
    // t.equal(equal(multiline1, multiline3), false, 'MultiLines are not equal');

    // var poly2 = helpers.polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    // var poly3 = helpers.polygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]]]);

    // t.equal(equal(poly1, poly2), true, 'Polys are equal');
    // t.equal(equal(poly1, poly3), false, 'Polys are not equal');

    // var multipoly1 = helpers.multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    // var multipoly2 = helpers.multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    // var multipoly3 = helpers.multiPolygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);

    // t.equal(equal(multipoly1, multipoly2), true, 'MultiPolys are equal');
    // t.equal(equal(multipoly1, multipoly3), false, 'MultiPolys are not equal');

    t.end();
});
