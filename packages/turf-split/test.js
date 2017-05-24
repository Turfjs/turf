var test = require('tape');
var split = require('./');

var polygon = {
    'type': 'Feature',
    'properties': {
        'population': 200
    },
    'geometry': {
        'type': 'Polygon',
        'coordinates': [[
            [0, 0],
            [0, 10],
            [10, 10],
            [10, 0],
            [0, 0]
        ]]
    }
};

var linestring = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
        'type': 'LineString',
        'coordinates': [
            [5, 15],
            [5, -15]
        ]
    }
};


var kinkedLinestring = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
        'type': 'LineString',
        'coordinates': [
            [5, 15],
            [5, -15],
            [5, -25]
        ]
    }
};

var expectedOutput = {
    'type': 'FeatureCollection',
    'features': [
        {'type': 'Feature',
        'properties': {
            'population': 200
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[
            [5, 10],
            [10, 10],
            [10, 0],
            [5, 0],
            [5, 10]
            ]]
        }},
        {'type': 'Feature',
        'properties': {
            'population': 200
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[
                [5, 0],
                [0, 0],
                [0, 10],
                [5, 10],
                [5, 0]
            ]]
        }
    }
    ]
};

test('split', function (t) {
    var splitPoly = split(polygon, linestring);
    t.equal(splitPoly.features.length, 2);
    t.deepEqual(splitPoly, expectedOutput);

    var splitPoly2 = split(polygon, kinkedLinestring);
    t.equal(splitPoly2, undefined);

    t.end();
});
