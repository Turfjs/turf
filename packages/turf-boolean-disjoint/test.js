var test = require('tape');
var helpers = require('@turf/helpers');
var disjoint = require('./');

test('turf-boolean-disjoint', function (t) {

    var p1 = helpers.point([0, 0]);
    var p2 = helpers.point([1, 1]);

    t.equal(disjoint(p1, p1), false, 'The points are the same and so disjoint is false');
    t.equal(disjoint(p1, p2), true, 'The points are different and so disjoint is true');

    var mp1 = helpers.multiPoint([[1, 1], [12, 12]]);
    var mp2 = helpers.multiPoint([[0, 0], [12, 12]]);
    var mp3 = helpers.multiPoint([[-1, -1], [-12, -12]]);

    t.equal(disjoint(p1, mp1), true, 'The point does not hit the multipoint so disjoint is true');
    t.equal(disjoint(p1, mp2), false, 'The point hits the multipoint so disjoint is false');

    t.equal(disjoint(mp1, mp1), false, 'The multipoints are the same so disjoint is false');
    t.equal(disjoint(mp1, mp3), true, 'The multipoints are different so disjoint is true');

    t.equal(disjoint(mp1, mp2), false, 'One of multipoints are the same so disjoint is false');

    var line1 = helpers.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);

    t.equal(disjoint(p1, line1), true, 'A point is far from the line so disjoint is true');
    t.equal(disjoint(p2, line1), false, 'A point is on the line so disjoint is false');

    var poly1 = helpers.polygon([[[-1, 2], [3, 2], [3, 3], [-1, 3], [-1, 2]]]);
    var p3 = helpers.point([2, 2.5]);

    t.equal(disjoint(p1, poly1), true, 'A point is outside a polygon so disjoint is true');
    t.equal(disjoint(p3, poly1), false, 'A point is inside a polygon so disjoint is false');

    t.equal(disjoint(mp1, line1), false, 'A multipoint is partially on a line so disjoint is false');
    t.equal(disjoint(mp2, line1), true, 'A multipoint does not touch a line so disjoint is true');


    // var mp2 = helpers.multiPoint([[2, 2], [1, -1.5]]);

    // var line2 = helpers.lineString([[-2, 2], [4, 2]]);
    // var line3 = helpers.lineString([[-2, 2], [-4, 2]]);
    // var line4 = helpers.lineString([[-2, 2], [1, 1]]);

    // t.equal(disjoint(line1, line2), true, 'True if lines cross');
    // t.equal(disjoint(line1, line3), false, 'False if lines cross');
    // t.equal(disjoint(line1, line4), false, 'False if lines only touch');

    // var line5 = helpers.lineString([[0.5, 2.5], [1, 1]]);

    // t.equal(cross(line3, poly1), false, 'False where a line does not cross a polygon');
    // t.equal(cross(line5, poly1), true, 'True where a line is both in and outside a polygon');

    t.end();
});
