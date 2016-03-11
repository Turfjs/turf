var test = require('tape'),
    fs = require('fs'),
    meta = require('./');

var pointGeometry = {
    type: 'Point',
    coordinates: [0, 0]
};

var lineStringGeometry = {
    type: 'LineString',
    coordinates: [[0, 0], [1, 1]]
};

var polygonGeometry = {
    type: 'Polygon',
    coordinates: [[[0, 0], [1, 1], [0, 1], [0, 0]]]
};

var multiPolygonGeometry = {
    type: 'MultiPolygon',
    coordinates: [[[[0, 0], [1, 1], [0, 1], [0, 0]]]]
};

var geometryCollection = {
    type: 'GeometryCollection',
    geometries: [pointGeometry, lineStringGeometry]
};

var pointFeature = {
    type: 'Feature',
    properties: { a: 1},
    geometry: pointGeometry
};

function collection(feature) {
    var featureCollection = {
        type: 'FeatureCollection',
        features: [feature]
    };

    return [feature, featureCollection];
}

function featureAndCollection(geometry) {
    var feature = {
        type: 'Feature',
        geometry: geometry,
        properties: { a: 1 }
    };

    var featureCollection = {
        type: 'FeatureCollection',
        features: [feature]
    };

    return [geometry, feature, featureCollection];
}


collection(pointFeature).forEach(function(input) {
    test('propEach', function(t) {
        meta.propEach(input, function(prop) {
            t.deepEqual(prop, { a: 1 });
            t.end();
        });
    });
});

featureAndCollection(pointGeometry).forEach(function(input) {
    test('coordEach#Point', function(t) {
        meta.coordEach(input, function(coord) {
            t.deepEqual(coord, [0, 0]);
            t.end();
        });
    });
});

featureAndCollection(lineStringGeometry).forEach(function(input) {
    test('coordEach#LineString', function(t) {
        var output = [];
        meta.coordEach(input, function(coord) {
            output.push(coord);
        });
        t.deepEqual(output, [[0, 0], [1, 1]]);
        t.end();
    });
});

featureAndCollection(polygonGeometry).forEach(function(input) {
    test('coordEach#Polygon', function(t) {
        var output = [];
        meta.coordEach(input, function(coord) {
            output.push(coord);
        });
        t.deepEqual(output, [[0, 0], [1, 1], [0, 1], [0, 0]]);
        t.end();
    });
});

featureAndCollection(polygonGeometry).forEach(function(input) {
    test('coordEach#Polygon excludeWrapCoord', function(t) {
        var output = [];
        meta.coordEach(input, function(coord) {
            output.push(coord);
        }, true);
        t.deepEqual(output, [[0, 0], [1, 1], [0, 1]]);
        t.end();
    });
});



featureAndCollection(multiPolygonGeometry).forEach(function(input) {
    test('coordEach#MultiPolygon', function(t) {
        var output = [];
        meta.coordEach(input, function(coord) {
            output.push(coord);
        });
        t.deepEqual(output, [[0, 0], [1, 1], [0, 1], [0, 0]]);
        t.end();
    });
});

featureAndCollection(geometryCollection).forEach(function(input) {
    test('coordEach#GeometryCollection', function(t) {
        var output = [];
        meta.coordEach(input, function(coord) {
            output.push(coord);
        });
        t.deepEqual(output, [[0, 0], [0, 0], [1, 1]]);
        t.end();
    });
});

test('unknown', function(t) {
    t.throws(function() {
        meta.coordEach({});
    });
    t.end();
});
