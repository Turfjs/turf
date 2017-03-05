const Benchmark = require('benchmark');
const flatten = require('.');

const suite = new Benchmark.Suite('turf-flatten');

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

for (const fixture of fixtures) {
    suite.add(fixture.type, () => flatten(fixture));
}

suite
    .on('cycle', (event) => { console.log(String(event.target)); })
    .on('complete', () => {})
    .run();
