const test = require('tape');
const {lineString, polygon, multiPoint} = require('@turf/helpers');
const overlap = require('./');

test('turf-boolean-overlap', t => {
    const mp1 = multiPoint([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]);
    const mp2 = multiPoint([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]);
    const mp3 = multiPoint([[10, 0], [10, 10], [10, 10], [10, 0], [0, 0]]);
    const mp4 = multiPoint([[100, 100], [20, 20]]);

    t.equal(overlap(mp1, mp2), false, 'MultiPoints are equal so overlap is false');
    t.equal(overlap(mp1, mp3), true, 'MultiPoints are not equal so overlap is true');
    t.equal(overlap(mp1, mp4), false, 'MultiPoints are have no overlaps so overlap is false');

    const line1 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    const line2 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
    const line3 = lineString([[2, 1], [1, 2], [1, 3], [2, 4]]);
    const line4 = lineString([[1, 2], [1, 3]]);

    t.equal(overlap(line1, line2), false, 'Lines are exactly equal so overlap is false');
    t.equal(overlap(line1, line3), true, 'Lines overlaps partially so overlap is true');
    t.equal(overlap(line4, line1), false, 'Lines is contained within other line so overlap is false');

    const poly1 = polygon([[[-1, 2], [3, 2], [3, 3], [-1, 3], [-1, 2]]]);
    const poly2 = polygon([[[0, 1], [3, 2], [3, 3], [-1, 3], [0, 1]]]);
    const poly3 = polygon([[[-10, 20], [30, 20], [30, 30], [-10, 30], [-10, 20]]]);
    const poly4 = polygon([[[1, 0], [4, 0], [4, 4], [1, 4], [1, 0]]]);


    t.equal(overlap(poly1, poly2), true, 'Polys have points inside so overlap is true');
    t.equal(overlap(poly1, poly3), false, 'Polys do not overlap so overlap is false');
    t.equal(overlap(poly1, poly4), true, 'Polys overlap via lines so overlap is true');

    t.end();
});
