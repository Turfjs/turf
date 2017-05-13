var test = require('tape');
var helpers = require('@turf/helpers');
var cross = require('./');

test('turf-boolean-cross', function (t) {

    var mp1 = helpers.multiPoint([[1, 1], [12, 12]]);
    var mp2 = helpers.multiPoint([[2, 2], [1, -1.5]]);
    var line1 = helpers.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);

    t.equal(cross(mp1, line1), true, 'A point is crosses the line');
    t.equal(cross(mp2, line1), false, 'A point does not cross the line');

    var line2 = helpers.lineString([[-2, 2], [4, 2]]);
    var line3 = helpers.lineString([[-2, 2], [-4, 2]]);
    var line4 = helpers.lineString([[-2, 2], [1, 1]]);

    t.equal(cross(line1, line2), true, 'True if lines cross');
    t.equal(cross(line1, line3), false, 'False if lines cross');
    t.equal(cross(line1, line4), false, 'False if lines only touch');

    var poly1 = helpers.polygon([[[-1, 2], [3, 2], [3, 3], [-1, 3], [-1, 2]]]);
    var line5 = helpers.lineString([[0.5, 2.5], [1, 1]]);

    t.equal(cross(line1, poly1), true, 'True where a line crosses a polygon');
    t.equal(cross(line3, poly1), false, 'False where a line does not cross a polygon');
    t.equal(cross(line5, poly1), true, 'True where a line is both in and outside a polygon');

    t.end();
});
