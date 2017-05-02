var test = require('tape');
var helpers = require('@turf/helpers');
var contains = require('../../contains.js');

test('turf-boolean-contains', function (t) {

    var pt1 = helpers.point([1, 1]);
    var pt2 = helpers.point([1, 4]);
    var pt3 = helpers.point([4, 4]);
    var pt4 = helpers.point([14, 14]);

    var mp1 = helpers.multiPoint([[1, 1], [12, 12]]);
    var mp2 = helpers.multiPoint([[1, 1], [1, 1.5]]);
    var mp3 = helpers.multiPoint([[1, 1], [12, 12], [15, 15]]);

    t.equal(contains(mp1, pt1), true, 'Point is contained within multipoint');
    t.equal(contains(mp1, pt2), false, 'Point is not contained outside multipoint');

    t.equal(contains(mp3, mp1), true, 'True if all multipoints are contained with within multipoints');
    t.equal(contains(mp3, mp2), false, 'False if some multipoints are elsewhere');

    var line1 = helpers.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    t.equal(contains(line1, pt1), true, 'Point is on line');
    t.equal(contains(line1, pt3), false, 'Point is not on line');

    t.equal(contains(line1, mp2), true, 'MultiPoint is on line');
    t.equal(contains(line1, mp3), false, 'MultiPoint is not on line');

    var poly1 = helpers.polygon([[[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]]);
    t.equal(contains(poly1, pt3), true, 'A point lies inside the polygon boundary');
    t.equal(contains(poly1, pt1), true, 'A point lies on the polygon boundary');
    t.equal(contains(poly1, pt4), false, 'A point lies outside the polygon boundary fails');

    var mp4 = helpers.multiPoint([[1, 1], [4, 4]]);
    t.equal(contains(poly1, mp4), true, 'A multipoint lies inside the polygon boundary');
    t.equal(contains(poly1, mp1), false, 'A multipoint with a point outside fails');


    var line2 = helpers.lineString([[1, 2], [1, 3], [1, 3.5]]);
    var line3 = helpers.lineString([[1, 2], [1, 3], [1, 15.5]]);

    t.equal(contains(line1, line2), true, 'A line lies inside the other line');
    t.equal(contains(line1, line3), false, 'A line fails that lies partially outside the other line');

    t.equal(contains(poly1, line1), true, 'A line within the poly passes as true');
    t.equal(contains(poly1, line3), false, 'A line that lies partially outside the poly is false');


    var poly2 = helpers.polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    var poly3 = helpers.polygon([[[1, 1], [1, 20], [1, 3], [1, 4], [1, 1]]]);

    t.equal(contains(poly1, poly2), true, 'A poly passes that is inside although allows touching edges');
    t.equal(contains(poly1, poly3), false, 'A poly fails that has a vertice outside the poly');

    t.end();
});
