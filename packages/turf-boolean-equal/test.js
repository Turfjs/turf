const test = require('tape');
const {point, lineString, polygon, multiPoint, multiLineString, multiPolygon} = require('@turf/helpers');
const equal = require('./');

test('turf-boolean-equal', t => {
    const pt1 = point([-75.343, 39.984]);
    const pt2 = point([-75.343, 39.984]);
    const pt3 = point([-5.343, 3.984]);

    t.true(equal(pt1, pt2), 'points are equal');
    t.false(equal(pt1, pt3), 'points are not equal');

    const mp1 = multiPoint([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]);
    const mp2 = multiPoint([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]);
    const mp3 = multiPoint([[10, 0], [10, 10], [10, 10], [10, 0], [0, 0]]);

    t.true(equal(mp1, mp2), 'MultiPoints are equal');
    t.false(equal(mp1, mp3), 'MultiPoints are not equal');

    const line1 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    const line2 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    const line3 = lineString([[2, 1], [2, 2], [2, 3], [2, 4]]);

    t.true(equal(line1, line2), 'Lines are equal');
    t.false(equal(line1, line3), 'Lines are not equal');


    const multiline1 = multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    const multiline2 = multiLineString([[[1, 1], [1, 2], [1, 3], [1, 4]], [[2, 1], [2, 2], [2, 3], [2, 4]]]);
    const multiline3 = multiLineString([[[2, 1], [2, 2], [2, 3], [2, 4]], [[3, 1], [3, 2], [3, 3], [3, 4]]]);

    t.true(equal(multiline1, multiline2), 'MultiLines are equal');
    t.false(equal(multiline1, multiline3), 'MultiLines are not equal');

    const poly1 = polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    const poly2 = polygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]]]);
    const poly3 = polygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]]]);

    t.true(equal(poly1, poly2), 'Polys are equal');
    t.false(equal(poly1, poly3), 'Polys are not equal');

    const multipoly1 = multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    const multipoly2 = multiPolygon([[[1, 1], [1, 2], [1, 3], [1, 4], [1, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);
    const multipoly3 = multiPolygon([[[2, 1], [2, 2], [2, 3], [2, 4], [2, 1]], [[3, 1], [3, 2], [3, 3], [3, 4], [3, 1]]]);

    t.true(equal(multipoly1, multipoly2), 'MultiPolys are equal');
    t.false(equal(multipoly1, multipoly3), 'MultiPolys are not equal');

    t.end();
});

test('turf-boolean-equal -- reduce coordinate precision', t => {
    const pt1 = point([30.2, 10]);
    const pt2 = point([30.22233, 10]);

    t.true(equal(pt1, pt2, false, 1));
    t.false(equal(pt1, pt2, false, 3));
    t.end();
});


test('turf-boolean-equal -- apply direction (orientation) rule', t => {
    const line1 = lineString([[30, 10], [10, 30], [40, 40]]);
    const line2 = lineString([[40, 40], [10, 30], [30, 10]]);

    t.true(equal(line1, line2, true));
    t.false(equal(line1, line2, false));
    t.end();
});


test('scale -- prevent input mutation', t => {
    const line1 = lineString([[30, 10], [10, 30], [40, 40]]);
    const line2 = lineString([[40, 40], [10, 30], [30, 10]]);
    const line1Before = JSON.parse(JSON.stringify(line1));
    const line2Before = JSON.parse(JSON.stringify(line2));

    equal(line1, line2, true, 3);
    t.deepEqual(line1, line1Before, 'input should NOT be mutated');
    t.deepEqual(line2, line2Before, 'input should NOT be mutated');
    t.end();
});
