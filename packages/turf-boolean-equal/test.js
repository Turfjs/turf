const test = require('tape');
const {point, lineString, polygon, multiPoint, multiLineString, multiPolygon} = require('@turf/helpers');
const equal = require('./');

test('turf-boolean-equal', t => {
    const pt1 = point([-75.343, 39.984]);
    const pt2 = point([-75.343, 39.984]);
    const pt3 = point([-5.343, 3.984]);

    t.equal(equal(pt1, pt2), true, 'points are equal');
    t.equal(equal(pt1, pt3), false, 'points are not equal');

    const mp1 = multiPoint([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]);
    const mp2 = multiPoint([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]);
    const mp3 = multiPoint([[10, 0], [10, 10], [10, 10], [10, 0], [0, 0]]);

    t.equal(equal(mp1, mp2), true, 'MultiPoints are equal');
    t.equal(equal(mp1, mp3), false, 'MultiPoints are not equal');

    const line1 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    const line2 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    const line3 = lineString([[2, 1], [2, 2], [2, 3], [2, 4]]);

    t.equal(equal(line1, line2), true, 'Lines are equal');
    t.equal(equal(line1, line3), false, 'Lines are not equal');


    const multiline1 = multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    const multiline2 = multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    const multiline3 = multiLineString([[[2, 1], [2, 2], [2, 3], [2, 4]], [[3, 1], [3, 2], [3, 3], [3, 4]]]);

    t.equal(equal(multiline1, multiline2), true, 'MultiLines are equal');
    t.equal(equal(multiline1, multiline3), false, 'MultiLines are not equal');

    const poly1 = polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    const poly2 = polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    const poly3 = polygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]]]);

    t.equal(equal(poly1, poly2), true, 'Polys are equal');
    t.equal(equal(poly1, poly3), false, 'Polys are not equal');

    const multipoly1 = multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    const multipoly2 = multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    const multipoly3 = multiPolygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);

    t.equal(equal(multipoly1, multipoly2), true, 'MultiPolys are equal');
    t.equal(equal(multipoly1, multipoly3), false, 'MultiPolys are not equal');

    t.end();
});
