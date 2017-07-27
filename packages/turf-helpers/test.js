const test = require('tape');
const {
    point,
    polygon,
    lineString,
    feature,
    featureCollection,
    multiLineString,
    multiPoint,
    multiPolygon,
    geometryCollection,
    radiansToDistance,
    distanceToRadians,
    distanceToDegrees,
    radians2degrees,
    degrees2radians,
    bearingToAngle,
    convertDistance,
    convertArea,
    round
} = require('./');

test('point', t => {
    const ptArray = point([5, 10], {name: 'test point'});

    t.ok(ptArray);
    t.equal(ptArray.geometry.coordinates[0], 5);
    t.equal(ptArray.geometry.coordinates[1], 10);
    t.equal(ptArray.properties.name, 'test point');

    t.throws(() => {
        point('hey', 'invalid');
    }, 'numbers required');

    const noProps = point([0, 0]);
    t.deepEqual(noProps.properties, {}, 'no props becomes {}');

    t.end();
});

test('polygon', t => {
    const poly = polygon([[[5, 10], [20, 40], [40, 0], [5, 10]]], {name: 'test polygon'});
    t.ok(poly);
    t.equal(poly.geometry.coordinates[0][0][0], 5);
    t.equal(poly.geometry.coordinates[0][1][0], 20);
    t.equal(poly.geometry.coordinates[0][2][0], 40);
    t.equal(poly.properties.name, 'test polygon');
    t.equal(poly.geometry.type, 'Polygon');
    t.throws(() => {
        t.equal(polygon([[[20.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]]).message);
    }, /First and last Position are not equivalent/, 'invalid ring - not wrapped');
    t.throws(() => {
        t.equal(polygon([[[20.0, 0.0], [101.0, 0.0]]]).message);
    }, /Each LinearRing of a Polygon must have 4 or more Positions/, 'invalid ring - too few positions');
    const noProperties = polygon([[[5, 10], [20, 40], [40, 0], [5, 10]]]);
    t.deepEqual(noProperties.properties, {});
    t.end();
});

test('lineString', t => {
    const line = lineString([[5, 10], [20, 40]], {name: 'test line'});
    t.ok(line, 'creates a linestring');
    t.equal(line.geometry.coordinates[0][0], 5);
    t.equal(line.geometry.coordinates[1][0], 20);
    t.equal(line.properties.name, 'test line');
    t.deepEqual(lineString([[5, 10], [20, 40]]).properties, {}, 'no properties case');

    t.throws(() => lineString(), 'error on no coordinates');
    t.throws(() => lineString([[5, 10]]), 'coordinates must be an array of two or more positions');
    t.end();
});

test('featureCollection', t => {
    const p1 = point([0, 0], {name: 'first point'});
    const p2 = point([0, 10]);
    const p3 = point([10, 10]);
    const p4 = point([10, 0]);
    const fc = featureCollection([p1, p2, p3, p4]);
    t.ok(fc);
    t.equal(fc.features.length, 4);
    t.equal(fc.features[0].properties.name, 'first point');
    t.equal(fc.type, 'FeatureCollection');
    t.equal(fc.features[1].geometry.type, 'Point');
    t.equal(fc.features[1].geometry.coordinates[0], 0);
    t.equal(fc.features[1].geometry.coordinates[1], 10);
    t.throws(() => featureCollection(fc), /features must be an Array/);
    t.throws(() => featureCollection(p1), /features must be an Array/);
    t.end();
});

test('multilinestring', t => {
    t.deepEqual(multiLineString([[[0, 0], [10, 10]], [[5, 0], [15, 8]]]), {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'MultiLineString',
            coordinates: [[[0, 0], [10, 10]], [[5, 0], [15, 8]]]
        }
    }, 'takes coordinates');

    t.deepEqual(multiLineString([[[0, 0], [10, 10]], [[5, 0], [15, 8]]], {test: 23}), {
        type: 'Feature',
        properties: {
            test: 23
        },
        geometry: {
            type: 'MultiLineString',
            coordinates: [[[0, 0], [10, 10]], [[5, 0], [15, 8]]]
        }
    }, 'takes properties');


    t.throws(() => {
        multiLineString();
    }, 'throws error with no coordinates');

    t.end();
});


test('multiPoint', t => {
    t.deepEqual(multiPoint([[0, 0], [10, 10]]), {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'MultiPoint',
            coordinates: [
                [0, 0],
                [10, 10]
            ]
        }
    }, 'takes coordinates');

    t.deepEqual(multiPoint([[0, 0], [10, 10]], {test: 23}), {
        type: 'Feature',
        properties: {
            test: 23
        },
        geometry: {
            type: 'MultiPoint',
            coordinates: [
                [0, 0],
                [10, 10]
            ]
        }
    }, 'takes properties');


    t.throws(() => {
        multiPoint();
    }, 'throws error with no coordinates');

    t.end();
});

test('feature', t => {
    const pt = {
        type: 'Point',
        coordinates: [
            67.5,
            32.84267363195431
        ]
    };
    const line = {
        type: 'LineString',
        coordinates: [
            [
                82.96875,
                58.99531118795094
            ],
            [
                72.7734375,
                55.57834467218206
            ],
            [
                84.0234375,
                55.57834467218206
            ]
        ]
    };
    const polygon = {
        type: 'Polygon',
        coordinates: [
            [
                [
                    85.78125,
                    -3.513421045640032
                ],
                [
                    85.78125,
                    13.581920900545844
                ],
                [
                    92.46093749999999,
                    13.581920900545844
                ],
                [
                    92.46093749999999,
                    -3.513421045640032
                ],
                [
                    85.78125,
                    -3.513421045640032
                ]
            ]
        ]
    };

    t.equal(feature(pt).type, 'Feature');
    t.equal(feature(line).type, 'Feature');
    t.equal(feature(polygon).type, 'Feature');
    t.deepEqual(feature(pt),
        {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [
                    67.5,
                    32.84267363195431
                ]
            }
        });

    t.end();
});

test('multipolygon', t =>{
    t.deepEqual(multiPolygon([[[[94, 57], [78, 49], [94, 43], [94, 57]]], [[[93, 19], [63, 7], [79, 0], [93, 19]]]]), {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'MultiPolygon',
            coordinates: [[[[94, 57], [78, 49], [94, 43], [94, 57]]], [[[93, 19], [63, 7], [79, 0], [93, 19]]]]
        }
    }, 'takes coordinates');

    t.deepEqual(multiPolygon([[[[94, 57], [78, 49], [94, 43], [94, 57]]], [[[93, 19], [63, 7], [79, 0], [93, 19]]]], {test: 23}), {
        type: 'Feature',
        properties: {
            test: 23
        },
        geometry: {
            type: 'MultiPolygon',
            coordinates: [[[[94, 57], [78, 49], [94, 43], [94, 57]]], [[[93, 19], [63, 7], [79, 0], [93, 19]]]]
        }
    }, 'takes properties');


    t.throws(() => {
        multiPolygon();
    }, 'throws error with no coordinates');

    t.end();
});

test('geometrycollection', t => {
    const pt = {
        type: 'Point',
        coordinates: [100, 0]
    };
    const line = {
        type: 'LineString',
        coordinates: [[101, 0], [102, 1]]
    };
    const gc = geometryCollection([pt, line]);

    t.deepEqual(gc, {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'GeometryCollection',
            geometries: [
                {
                    type: 'Point',
                    coordinates: [100, 0]
                },
                {
                    type: 'LineString',
                    coordinates: [[101, 0], [102, 1]]
                }
            ]
        }
    }, 'creates a GeometryCollection');

    const gcWithProps = geometryCollection([pt, line], {a: 23});
    t.deepEqual(gcWithProps, {
        type: 'Feature',
        properties: {a: 23},
        geometry: {
            type: 'GeometryCollection',
            geometries: [
                {
                    type: 'Point',
                    coordinates: [100, 0]
                },
                {
                    type: 'LineString',
                    coordinates: [[101, 0], [102, 1]]
                }
            ]
        }
    }, 'creates a GeometryCollection with properties');

    t.end();
});

test('radiansToDistance', t => {
    t.equal(radiansToDistance(1, 'radians'), 1);
    t.equal(radiansToDistance(1, 'kilometers'), 6373);
    t.equal(radiansToDistance(1, 'miles'), 3960);
    t.throws(() => radiansToDistance(1, 'foo'), 'invalid units');
    t.end();
});

test('distanceToRadians', t => {
    t.equal(distanceToRadians(1, 'radians'), 1);
    t.equal(distanceToRadians(6373, 'kilometers'), 1);
    t.equal(distanceToRadians(3960, 'miles'), 1);
    t.throws(() => distanceToRadians(1, 'foo'), 'invalid units');
    t.end();
});

test('distanceToDegrees', t => {
    t.equal(distanceToDegrees(1, 'radians'), 57.29577951308232);
    t.equal(distanceToDegrees(100, 'kilometers'), 0.8990393772647469);
    t.equal(distanceToDegrees(10, 'miles'), 0.14468631190172304);
    t.throws(() => distanceToRadians(1, 'foo'), 'invalid units');
    t.end();
});

test('radians2degrees', t => {
    t.equal(round(radians2degrees(Math.PI / 3), 6), 60, 'radiance conversion PI/3');
    t.equal(radians2degrees(3.5 * Math.PI), 270, 'radiance conversion 3.5PI');
    t.equal(radians2degrees(-Math.PI), -180, 'radiance conversion -PI');
    t.end();
});

test('radians2degrees', t => {
    t.equal(degrees2radians(60), Math.PI / 3, 'degrees conversion 60');
    t.equal(degrees2radians(270), 1.5 * Math.PI, 'degrees conversion 270');
    t.equal(degrees2radians(-180), -Math.PI, 'degrees conversion -180');
    t.end();
});

test('bearingToAngle', t => {
    t.equal(bearingToAngle(40), 40);
    t.equal(bearingToAngle(-105), 255);
    t.equal(bearingToAngle(410), 50);
    t.equal(bearingToAngle(-200), 160);
    t.equal(bearingToAngle(-395), 325);
    t.end();
});

test('round', t => {
    t.equal(round(125.123), 125);
    t.equal(round(123.123, 1), 123.1);
    t.equal(round(123.5), 124);
    t.throws(() => round(34.5, 'precision'), 'invalid precision');
    t.throws(() => round(34.5, -5), 'invalid precision');
    t.end();
});

test('convertDistance', t => {
    t.equal(convertDistance(1000, 'meters'), 1);
    t.equal(convertDistance(1, 'kilometers', 'miles'), 0.6213714106386318);
    t.equal(convertDistance(1, 'miles', 'kilometers'), 1.6093434343434343);
    t.equal(convertDistance(1, 'nauticalmiles'), 1.851999843075488);
    t.equal(convertDistance(1, 'meters', 'centimeters'), 100);
    t.throws(() => convertDistance(1, 'foo'), 'invalid units');
    t.end();
});

test('convertArea', t => {
    t.equal(convertArea(1000), 0.001);
    t.equal(convertArea(1, 'kilometres', 'miles'), 0.386);
    t.equal(convertArea(1, 'miles', 'kilometers'), 2.5906735751295336);
    t.equal(convertArea(1, 'meters', 'centimetres'), 10000);
    t.equal(convertArea(100, 'metres', 'acres'), 0.0247105);
    t.equal(convertArea(100, null, 'yards'), 119.59900459999999);
    t.equal(convertArea(100, 'metres', 'feet'), 1076.3910417);
    t.equal(convertArea(100000, 'feet', null), 0.009290303999749462);
    t.throws(() => convertDistance(1, 'foo'), 'invalid original units');
    t.throws(() => convertDistance(1, 'meters', 'foo'), 'invalid final units');

    t.end();
});

// https://github.com/Turfjs/turf/issues/853
// https://github.com/Turfjs/turf/pull/866#discussion_r129873661
test('null geometries', t => {
    t.equal(feature(null).geometry, null, 'feature');
    t.equal(featureCollection([feature(null)]).features[0].geometry, null, 'featureCollection');
    t.equal(geometryCollection([feature(null).geometry]).geometry.geometries[0], null, 'geometryCollection');
    t.equal(geometryCollection([]).geometry.geometries.length, 0, 'geometryCollection -- empty');
    t.end();
});
