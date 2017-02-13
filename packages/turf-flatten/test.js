var flatten = require('./');
var test = require('tape');

test('flatten', function (t) {
    var fixtures = [
        {
            'type': 'MultiPoint',
            'coordinates': [[100.0, 0.0], [101.0, 1.0]]
        },
        {
            'type': 'MultiLineString',
            'coordinates': [
            [[100.0, 0.0], [101.0, 1.0]],
            [[102.0, 2.0], [103.0, 3.0]]
            ]
        },
        {
            'type': 'MultiPolygon',
            'coordinates': [
            [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
            [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
            [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
            ]
        },
        {
            'type': 'GeometryCollection',
            'geometries': [
                {
                    'type': 'Point',
                    'coordinates': [100.0, 0.0]
                },
                {
                    'type': 'LineString',
                    'coordinates': [[101.0, 0.0], [102.0, 1.0]]
                }
            ]
        },
        {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [
                        [[36.38671875, 52.05249047600099],
                        [27.94921875, 50.51342652633956],
                        [29.70703125, 46.55886030311719],
                        [36.38671875, 52.05249047600099]
                        ]
                        ]
                    }
                },
                {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [38.232421875, 40.111688665595956],
                            [25.400390625, 35.60371874069731],
                            [32.08007812499999, 33.43144133557529]
                        ]
                    }
                }
            ]
        }
    ];

    fixtures.forEach(function (geom) {
        if (geom.type !== 'FeatureCollection') {
            var fixture = {
                type: 'Feature',
                geometry: geom,
                properties: {}
            };

            var fc = flatten(fixture);

            t.equal(fc.type, 'FeatureCollection', 'feature outputs a featurecollection');
            t.true(fc.features.length > 1, 'featurecollection has multiple features with feature input');
        } else {
            var fc2 = flatten(geom);
            t.equal(fc2.type, 'FeatureCollection', 'feature outputs a featurecollection');
            t.true(fc2.features.length > 1, 'featurecollection has multiple features with feature input');
        }
    });

    fixtures.forEach(function (geom) {
        if (geom.type !== 'FeatureCollection' && geom.type !== 'Feature') {
            var fc = flatten(geom);
            t.equal(fc.type, 'FeatureCollection', 'geometry outputs a featurecollection');
            t.true(fc.features.length > 1, 'featurecollection has multiple features with geometry input');
        }
    });

    t.end();
});
