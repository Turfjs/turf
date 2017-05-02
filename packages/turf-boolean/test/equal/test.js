var test = require('tape');
var helpers = require('@turf/helpers');
var equal = require('../../equal.js');

test('turf-boolean-equal', function (t) {
    var pt1 = helpers.point([-75.343, 39.984]);
    var pt2 = helpers.point([-75.343, 39.984]);
    var pt3 = helpers.point([-5.343, 3.984]);

    t.equal(equal(pt1, pt2), true, 'points are equal');
    t.equal(equal(pt1, pt3), false, 'points are not equal');

    var mp1 = helpers.multiPoint([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]);
    var mp2 = helpers.multiPoint([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]);
    var mp3 = helpers.multiPoint([[10, 0], [10, 10], [10, 10], [10, 0], [0, 0]]);

    t.equal(equal(mp1, mp2), true, 'MultiPoints are equal');
    t.equal(equal(mp1, mp3), false, 'MultiPoints are not equal');

    var line1 = helpers.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    var line2 = helpers.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    var line3 = helpers.lineString([[2, 1], [2, 2], [2, 3], [2, 4]]);

    t.equal(equal(line1, line2), true, 'Lines are equal');
    t.equal(equal(line1, line3), false, 'Lines are not equal');


    var multiline1 = helpers.multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    var multiline2 = helpers.multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    var multiline3 = helpers.multiLineString([[[2, 1], [2, 2], [2, 3], [2, 4]], [[3, 1], [3, 2], [3, 3], [3, 4]]]);

    t.equal(equal(multiline1, multiline2), true, 'MultiLines are equal');
    t.equal(equal(multiline1, multiline3), false, 'MultiLines are not equal');

    var poly1 = helpers.polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    var poly2 = helpers.polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    var poly3 = helpers.polygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]]]);

    t.equal(equal(poly1, poly2), true, 'Polys are equal');
    t.equal(equal(poly1, poly3), false, 'Polys are not equal');

    var multipoly1 = helpers.multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    var multipoly2 = helpers.multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    var multipoly3 = helpers.multiPolygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);

    t.equal(equal(multipoly1, multipoly2), true, 'MultiPolys are equal');
    t.equal(equal(multipoly1, multipoly3), false, 'MultiPolys are not equal');

    t.end();
});
