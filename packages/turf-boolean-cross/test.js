const test = require('tape');
const {multiPoint, lineString, polygon} = require('@turf/helpers');
const cross = require('./');

test('turf-boolean-cross', t => {

    const mp1 = multiPoint([[1, 1], [12, 12]]);
    const mp2 = multiPoint([[2, 2], [1, -1.5]]);
    const line1 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);

    t.equal(cross(mp1, line1), true, 'A point is crosses the line');
    t.equal(cross(mp2, line1), false, 'A point does not cross the line');

    const line2 = lineString([[-2, 2], [4, 2]]);
    const line3 = lineString([[-2, 2], [-4, 2]]);
    const line4 = lineString([[-2, 2], [1, 1]]);

    t.equal(cross(line1, line2), true, 'True if lines cross');
    t.equal(cross(line1, line3), false, 'False if lines cross');
    t.equal(cross(line1, line4), false, 'False if lines only touch');

    const poly1 = polygon([[[-1, 2], [3, 2], [3, 3], [-1, 3], [-1, 2]]]);
    const line5 = lineString([[0.5, 2.5], [1, 1]]);

    t.equal(cross(line1, poly1), true, 'True where a line crosses a polygon');
    t.equal(cross(line3, poly1), false, 'False where a line does not cross a polygon');
    t.equal(cross(line5, poly1), true, 'True where a line is both in and outside a polygon');

    t.end();
});
