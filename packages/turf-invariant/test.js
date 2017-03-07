var test = require('tape'),
    invariant = require('./');

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
