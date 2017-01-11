var turfCollect = require('./');
var test = require('tape');
var polygon = require('@turf/helpers').polygon;
var point = require('@turf/helpers').point;
var featurecollection = require('@turf/helpers').featureCollection;

test('turf collect module', function (t) {
    var poly1 = polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
    var poly2 = polygon([[[10, 0], [20, 10], [20, 20], [20, 0], [10, 0]]]);
    var poly3 = polygon([[[100, 0], [110, -10], [110, -20], [100, 0]]]);
    var polyFC = featurecollection([poly1, poly2, poly3]);
    var pt1 = point([5, 5], {population: 200});
    var pt2 = point([1, 3], {population: 600});
    var pt3 = point([14, 2], {population: 100});
    var pt4 = point([13, 1], {population: 200});
    var pt5 = point([19, 7], {population: 300});
    var ptFC = featurecollection([pt1, pt2, pt3, pt4, pt5]);
    var aggregated = turfCollect(polyFC, ptFC, 'population', 'values');
    // Check the same number of input and output polys are the same
    t.equal(polyFC.features.length, aggregated.features.length);
    // Check the right values have been assigned
    t.deepEqual(aggregated.features[0].properties.values, [200, 600]);
    t.deepEqual(aggregated.features[1].properties.values, [100, 200, 300]);

    // Check the property has been created even if no values have been assigned
    t.deepEqual(aggregated.features[2].properties.values, []);
    t.end();
});
