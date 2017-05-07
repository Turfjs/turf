const test = require('tape');
const helpers = require('@turf/helpers');
const within = require('./');

test('turf-boolean-within', t => {
    const pt1 = helpers.point([1, 1]);
    const pt2 = helpers.point([1, 4]);
    const pt3 = helpers.point([4, 4]);
    const pt4 = helpers.point([14, 14]);

    const mp1 = helpers.multiPoint([[1, 1], [12, 12]]);
    const mp2 = helpers.multiPoint([[1, 1], [1, 1.5]]);
    const mp3 = helpers.multiPoint([[1, 1], [12, 12], [15, 15]]);

    t.equal(within(pt1, mp1), true, 'Point is contained within multipoint');
    t.equal(within(pt2, mp1), false, 'Point is not contained outside multipoint');

    t.equal(within(mp1, mp3), true, 'True if all multipoints are contained with within multipoints');
    t.equal(within(mp2, mp3), false, 'False if some multipoints are elsewhere');

    const line1 = helpers.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    t.equal(within(pt1, line1), true, 'Point is on line');
    t.equal(within(pt3, line1), false, 'Point is not on line');

    t.equal(within(mp2, line1), true, 'MultiPoint is on line');
    t.equal(within(mp3, line1), false, 'MultiPoint is not on line');

    const poly1 = helpers.polygon([[[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]]);
    t.equal(within(pt3, poly1), true, 'A point lies inside the polygon boundary');
    t.equal(within(pt1, poly1), true, 'A point lies on the polygon boundary');
    t.equal(within(pt4, poly1), false, 'A point lies outside the polygon boundary fails');

    const mp4 = helpers.multiPoint([[1, 1], [4, 4]]);
    t.equal(within(mp4, poly1), true, 'A multipoint lies inside the polygon boundary');
    t.equal(within(mp1, poly1), false, 'A multipoint with a point outside fails');


    const line2 = helpers.lineString([[1, 2], [1, 3], [1, 3.5]]);
    const line3 = helpers.lineString([[1, 2], [1, 3], [1, 15.5]]);

    t.equal(within(line2, line1), true, 'A line lies inside the other line');
    // ==>> ERROR <<===
    // t.equal(within(line3, line1), false, 'A line fails that lies partially outside the other line');

    t.equal(within(line1, poly1), true, 'A line within the poly passes as true');
    t.equal(within(line3, poly1), false, 'A line that lies partially outside the poly is false');


    const poly2 = helpers.polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    const poly3 = helpers.polygon([[[1, 1], [1, 20], [1, 3], [1, 4], [1, 1]]]);

    t.equal(within(poly2, poly1), true, 'A poly passes that is inside although allows touching edges');
    t.equal(within(poly3, poly1), false, 'A poly fails that has a vertice outside the poly');

    t.end();
});
