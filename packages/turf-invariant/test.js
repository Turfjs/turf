var test = require('tape'),
    invariant = require('./');

test('invariant#geojsonType', function(t) {
    t.throws(function() {
        invariant.geojsonType();
    }, /type and name required/, '.geojsonType() name requirement');

    t.throws(function() {
        invariant.geojsonType({}, undefined, 'myfn');
    }, /type and name required/, 'invalid types');

    t.throws(function() {
        invariant.geojsonType({
            type: 'Point',
            coordinates: [0, 0]
        }, 'Polygon', 'myfn');
    }, /Invalid input to myfn: must be a Polygon, given Point/, 'invalid geometry type');

    t.doesNotThrow(function() {
        invariant.geojsonType({
            type: 'Point',
            coordinates: [0, 0]
        }, 'Point', 'myfn');
    }, 'valid geometry');

    t.end();
});

test('invariant#featureOf', function(t) {
    t.throws(function() {
        invariant.featureOf(
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {}
        }, 'Polygon');
    }, /requires a name/, 'requires a name');

    t.throws(function() {
        invariant.featureOf({}, 'Polygon', 'foo');
    }, /Feature with geometry required/, 'requires a feature');

    t.throws(function() {
        invariant.featureOf(
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {}
        }, 'Polygon', 'myfn');
    }, /Invalid input to myfn: must be a Polygon, given Point/, 'invalid geometry type');

    t.doesNotThrow(function() {
        invariant.featureOf(
        {
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

test('invariant#collectionOf', function(t) {
    t.throws(function() {
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

    t.throws(function() {
        invariant.collectionOf({}, 'Polygon');
    }, /requires a name/, 'requires a name');

    t.throws(function() {
        invariant.collectionOf({}, 'Polygon', 'foo');
    }, /FeatureCollection required/, 'requires a featurecollection');

    t.doesNotThrow(function() {
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

test('invariant#getCoord', function(t) {
    t.deepEqual(invariant.getCoord({
        type: 'Point',
        coordinates: [1, 2]
    }), [1, 2]);

    t.deepEqual(invariant.getCoord({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [1, 2]
        },
        properties: {}
    }), [1, 2]);
    t.end();
});
