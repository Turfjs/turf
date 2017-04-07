const test = require('tape');
const {point, lineString, polygon} = require('@turf/helpers');
const invariant = require('./');

test('invariant#containsNumber', t => {
    t.equals(invariant.containsNumber([1, 1]), true);
    t.equals(invariant.containsNumber([[1, 1], [1, 1]]), true);
    t.equals(invariant.containsNumber([[[1,1], [1,1]], [1, 1]]), true);

    //# Ensure recusive call handles Max callstack exceeded
    t.throws(() => {
        invariant.containsNumber(['1', 1]);
    }, /coordinates must only contain numbers/, 'Must only contain numbers');
    t.end();
});

test('invariant#geojsonType', t => {
    t.throws(() => {
        invariant.geojsonType();
    }, /type and name required/, '.geojsonType() name requirement');

    t.throws(() => {
        invariant.geojsonType({}, undefined, 'myfn');
    }, /type and name required/, 'invalid types');

    t.throws(() => {
        invariant.geojsonType({
            type: 'Point',
            coordinates: [0, 0]
        }, 'Polygon', 'myfn');
    }, /Invalid input to myfn: must be a Polygon, given Point/, 'invalid geometry type');

    t.doesNotThrow(() => {
        invariant.geojsonType({
            type: 'Point',
            coordinates: [0, 0]
        }, 'Point', 'myfn');
    }, 'valid geometry');

    t.end();
});

test('invariant#featureOf', t => {
    t.throws(() => {
        invariant.featureOf({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {}
        }, 'Polygon');
    }, /requires a name/, 'requires a name');

    t.throws(() => {
        invariant.featureOf({}, 'Polygon', 'foo');
    }, /Feature with geometry required/, 'requires a feature');

    t.throws(() => {
        invariant.featureOf({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {}
        }, 'Polygon', 'myfn');
    }, /Invalid input to myfn: must be a Polygon, given Point/, 'invalid geometry type');

    t.doesNotThrow(() => {
        invariant.featureOf({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {}
        }, 'Point', 'myfn');
    }, 'valid geometry type');

    t.end();
});

test('invariant#collectionOf', t => {
    t.throws(() => {
        invariant.collectionOf({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [0, 0]
                    },
                    properties: {}
                }
            ]
        }, 'Polygon', 'myfn');
    }, /Invalid input to myfn: must be a Polygon, given Point/, 'invalid geometry type');

    t.throws(() => {
        invariant.collectionOf({}, 'Polygon');
    }, /requires a name/, 'requires a name');

    t.throws(() => {
        invariant.collectionOf({}, 'Polygon', 'foo');
    }, /FeatureCollection required/, 'requires a featurecollection');

    t.doesNotThrow(() => {
        invariant.collectionOf({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [0, 0]
                    },
                    properties: {}
                }
            ]
        }, 'Point', 'myfn');
    }, 'valid geometry type');

    t.end();
});

test('invariant#getCoord', t => {
    t.throws(() => invariant.getCoord(lineString([[1, 2], [3, 4]])));
    t.throws(() => invariant.getCoord(polygon([[[-75, 40], [-80, 50], [-70, 50], [-75, 40]]])));

    t.deepEqual(invariant.getCoord({
        type: 'Point',
        coordinates: [1, 2]
    }), [1, 2]);

    t.deepEqual(invariant.getCoord(point([1, 2])), [1, 2]);
    t.end();
});

test('invariant#getCoord', t => {
    t.throws(() => invariant.getCoord({
        type: 'LineString',
        coordinates: [[1, 2], [3, 4]]
    }));

    t.throws(() => invariant.getCoord(false));
    t.throws(() => invariant.getCoord(null));
    t.throws(() => invariant.getCoord(lineString([[1, 2], [3, 4]])));
    t.throws(() => invariant.getCoord(['A', 'B', 'C']));
    t.throws(() => invariant.getCoord([1, 'foo', 'bar']));

    t.deepEqual(invariant.getCoord({
        type: 'Point',
        coordinates: [1, 2]
    }), [1, 2]);

    t.deepEqual(invariant.getCoord(point([1, 2])), [1, 2]);
    t.deepEqual(invariant.getCoord([1, 2]), [1, 2]);
    t.end();
});

test('invariant#getCoords', t => {
    t.throws(() => invariant.getCoords({
        type: 'LineString',
        coordinates: null
    }));

    t.throws(() => invariant.getCoords(false));
    t.throws(() => invariant.getCoords(null));
    t.throws(() => invariant.getCoords(['A', 'B', 'C']));
    t.throws(() => invariant.getCoords([1, 'foo', 'bar']));

    t.deepEqual(invariant.getCoords({
        type: 'LineString',
        coordinates: [[1, 2], [3, 4]]
    }), [[1, 2], [3, 4]]);

    t.deepEqual(invariant.getCoords(point([1, 2])), [1, 2]);
    t.deepEqual(invariant.getCoords(lineString([[1, 2], [3, 4]])), [[1, 2], [3, 4]]);
    t.deepEqual(invariant.getCoords([1, 2]), [1, 2]);
    t.end();
});
