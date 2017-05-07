const test = require('tape');
const {point, lineString, polygon, multiPoint, multiLineString, multiPolygon} = require('@turf/helpers');
const touch = require('./');

test('turf-boolean-touch', t => {
    const pt1 = point([1, 1]);
    const pt2 = point([1, 4]);
    const line1 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    const pointOnMiddleOfLine = point([1, 2]);
    const pointNotOnLine = point([12, 12]);

    t.equal(touch(pt1, line1), true, 'point on start vertice touches linestring');
    t.equal(touch(pt2, line1), true, 'point on end vertice touches linestring');
    t.equal(touch(pointOnMiddleOfLine, line1), false, 'point in the middle of vertices does not touch linestring');
    t.equal(touch(pointNotOnLine, line1), false, 'point far away does not touch linestring');

    const mp1 = multiPoint([[1, 1], [12, 12]]);
    const mp2 = multiPoint([[1, 1], [1, 1.5]]);
    const mp3 = multiPoint([[1, 1], [1, 4]]);

    t.equal(touch(mp1, line1), true, 'Single multipoint on end of line returns true');
    t.equal(touch(mp2, line1), false, 'Multiple points on line returns false');
    t.equal(touch(mp3, line1), false, 'Points on start and end of line returns false');

    const poly1 = polygon([[[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]]);

    t.equal(touch(pt1, poly1), true, 'A point lies on the polygon boundary');
    t.equal(touch(pointNotOnLine, poly1), false, 'A point does not lie on the polygon boundary');

    t.equal(touch(mp1, poly1), true, 'A multipoint lies on the polygon boundary');
    t.equal(touch(mp2, poly1), false, 'Multiple points that lie on the polygon boundary returns false');
    t.equal(touch(mp3, poly1), false, 'A point from a Multipoint that falls inside the polygon boundary returns false');

    // const multiline1 = multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    // const multiline2 = multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    // const multiline3 = multiLineString([[[2, 1], [2, 2], [2, 3], [2, 4]], [[3, 1], [3, 2], [3, 3], [3, 4]]]);

    // t.equal(equal(multiline1, multiline2), true, 'MultiLines are equal');
    // t.equal(equal(multiline1, multiline3), false, 'MultiLines are not equal');

    // const poly2 = polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    // const poly3 = polygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]]]);

    // t.equal(equal(poly1, poly2), true, 'Polys are equal');
    // t.equal(equal(poly1, poly3), false, 'Polys are not equal');

    // const multipoly1 = multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    // const multipoly2 = multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    // const multipoly3 = multiPolygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);

    // t.equal(equal(multipoly1, multipoly2), true, 'MultiPolys are equal');
    // t.equal(equal(multipoly1, multipoly3), false, 'MultiPolys are not equal');

    t.end();
});
