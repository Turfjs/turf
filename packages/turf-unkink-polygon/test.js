var test = require('tape');
var unkink = require('./');

test('kinks', function (t) {
    var poly = {
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[[0, 0], [2, 0], [0, 2], [2, 2], [0, 0]]]
        }
    };

    var legitPoly = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[[0, 0], [2, 0], [1, 1], [0, 0]]]
        }
    };

    var expectedOutput = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[[0, 0], [2, 0], [1, 1], [0, 0]]]
                }
            }, {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[[1, 1], [0, 2], [2, 2], [1, 1]]]
                }
            }
        ]
    };
    // Test unkinging a kinked poly
    var unkinked = unkink(poly);
    t.equals(unkinked.features.length, 2);
    t.deepEquals(unkinked, expectedOutput);

    // Test unkinking an unkinkged poly - nothing should happen
    var unkinked2 = unkink(legitPoly);
    t.equals(unkinked2.features.length, 1);
    t.deepEquals({'type': 'FeatureCollection', 'features': [legitPoly]}, unkinked2);

    t.end();
});
