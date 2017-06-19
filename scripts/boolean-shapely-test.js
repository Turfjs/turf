const test = require('tape');
const booleanShapely = require('./boolean-shapely');
const {lineString, polygon} = require('@turf/helpers');

const operation = 'crosses';
const feature1 = lineString([[-2, 2], [1, 1]]);
const feature2 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
const feature3 = polygon([[[-1, 2], [3, 2], [3, 3], [-1, 3], [-1, 2]]]);

test('boolean-shapely', t => {
    // false
    booleanShapely(operation, feature1, feature2)
        .then(result => t.false(result));

    // true
    booleanShapely(operation, feature2, feature3)
        .then(result => t.true(result));
    t.end();
});
