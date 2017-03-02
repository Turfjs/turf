var test = require('tape');
var lineString = require('@turf/helpers').lineString;
var meta = require('./');

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
    properties: {a: 1},
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
        properties: {a: 1}
    };

    var featureCollection = {
        type: 'FeatureCollection',
        features: [feature]
    };

    return [geometry, feature, featureCollection];
}


collection(pointFeature).forEach(function (input) {
    test('propEach', function (t) {
        meta.propEach(input, function (prop, i) {
            t.deepEqual(prop, {a: 1});
            t.equal(i, 0);
            t.end();
        });
    });
});

featureAndCollection(pointGeometry).forEach(function (input) {
    test('coordEach#Point', function (t) {
        meta.coordEach(input, function (coord, index) {
            t.deepEqual(coord, [0, 0]);
            t.equal(index, 0);
            t.end();
        });
    });
});

featureAndCollection(lineStringGeometry).forEach(function (input) {
    test('coordEach#LineString', function (t) {
        var output = [];
        var lastIndex;
        meta.coordEach(input, function (coord, index) {
            output.push(coord);
            lastIndex = index;
        });
        t.deepEqual(output, [[0, 0], [1, 1]]);
        t.equal(lastIndex, 1);
        t.end();
    });
});

featureAndCollection(polygonGeometry).forEach(function (input) {
    test('coordEach#Polygon', function (t) {
        var output = [];
        var lastIndex;
        meta.coordEach(input, function (coord, index) {
            output.push(coord);
            lastIndex = index;
        });
        t.deepEqual(output, [[0, 0], [1, 1], [0, 1], [0, 0]]);
        t.equal(lastIndex, 3);
        t.end();
    });
});

featureAndCollection(polygonGeometry).forEach(function (input) {
    test('coordEach#Polygon excludeWrapCoord', function (t) {
        var output = [];
        var lastIndex;
        meta.coordEach(input, function (coord, index) {
            output.push(coord);
            lastIndex = index;
        }, true);
        t.deepEqual(output, [[0, 0], [1, 1], [0, 1]]);
        t.equal(lastIndex, 2);
        t.end();
    });
});



featureAndCollection(multiPolygonGeometry).forEach(function (input) {
    test('coordEach#MultiPolygon', function (t) {
        var output = [];
        var lastIndex;
        meta.coordEach(input, function (coord, index) {
            output.push(coord);
            lastIndex = index;
        });
        t.deepEqual(output, [[0, 0], [1, 1], [0, 1], [0, 0]]);
        t.equal(lastIndex, 3);
        t.end();
    });
});

featureAndCollection(geometryCollection).forEach(function (input) {
    test('coordEach#GeometryCollection', function (t) {
        var output = [];
        var lastIndex;
        meta.coordEach(input, function (coord, index) {
            output.push(coord);
            lastIndex = index;
        });
        t.deepEqual(output, [[0, 0], [0, 0], [1, 1]]);
        t.equal(lastIndex, 2);
        t.end();
    });
});

test('coordReduce#initialValue', function (t) {
    var lastIndex;
    var line = lineString([[126, -11], [129, -21], [135, -31]]);
    var sum = meta.coordReduce(line, function (previousValue, currentCoords, currentIndex) {
        lastIndex = currentIndex;
        return previousValue + currentCoords[0];
    }, 0);
    t.equal(lastIndex, 2);
    t.equal(sum, 390);
    t.end();
});

test('Array.reduce()#initialValue', function (t) {
    var lastIndex;
    var line = [[126, -11], [129, -21], [135, -31]];
    var sum = line.reduce(function (previousValue, currentCoords, currentIndex) {
        lastIndex = currentIndex;
        return previousValue + currentCoords[0];
    }, 0);
    t.equal(lastIndex, 2);
    t.equal(sum, 390);
    t.end();
});

test('coordReduce#previous-coordinates', function (t) {
    var lastIndex;
    var coords = [];
    var line = lineString([[126, -11], [129, -21], [135, -31]]);
    meta.coordReduce(line, function (previousCoords, currentCoords, currentIndex) {
        lastIndex = currentIndex;
        coords.push(currentCoords);
        return currentCoords;
    });
    t.equal(lastIndex, 2);
    t.equal(coords.length, 2);
    t.end();
});

test('Array.reduce()#previous-coordinates', function (t) {
    var lastIndex;
    var coords = [];
    var line = [[126, -11], [129, -21], [135, -31]];
    line.reduce(function (previousCoords, currentCoords, currentIndex) {
        lastIndex = currentIndex;
        coords.push(currentCoords);
        return currentCoords;
    });
    t.equal(lastIndex, 2);
    t.equal(coords.length, 2);
    t.end();
});


test('coordReduce#previous-coordinates+initialValue', function (t) {
    var lastIndex;
    var coords = [];
    var line = lineString([[126, -11], [129, -21], [135, -31]]);
    meta.coordReduce(line, function (previousCoords, currentCoords, currentIndex) {
        lastIndex = currentIndex;
        coords.push(currentCoords);
        return currentCoords;
    }, line.geometry.coordinates[0]);
    t.equal(lastIndex, 2);
    t.equal(coords.length, 3);
    t.end();
});

test('Array.reduce()#previous-coordinates+initialValue', function (t) {
    var lastIndex;
    var coords = [];
    var line = [[126, -11], [129, -21], [135, -31]];
    line.reduce(function (previousCoords, currentCoords, currentIndex) {
        lastIndex = currentIndex;
        coords.push(currentCoords);
        return currentCoords;
    }, line[0]);
    t.equal(lastIndex, 2);
    t.equal(coords.length, 3);
    t.end();
});

test('unknown', function (t) {
    t.throws(function () {
        meta.coordEach({});
    });
    t.end();
});

featureAndCollection(geometryCollection).forEach(function (input) {
    test('geomEach#GeometryCollection', function (t) {
        var output = [];
        meta.geomEach(input, function (geom) {
            output.push(geom);
        });
        t.deepEqual(output, geometryCollection.geometries);
        t.end();
    });
});

test('geomEach#bare-GeometryCollection', function (t) {
    var output = [];
    meta.geomEach(geometryCollection, function (geom) {
        output.push(geom);
    });
    t.deepEqual(output, geometryCollection.geometries);
    t.end();
});

test('geomEach#bare-pointGeometry', function (t) {
    var output = [];
    meta.geomEach(pointGeometry, function (geom) {
        output.push(geom);
    });
    t.deepEqual(output, [pointGeometry]);
    t.end();
});

test('geomEach#bare-pointFeature', function (t) {
    var output = [];
    meta.geomEach(pointFeature, function (geom) {
        output.push(geom);
    });
    t.deepEqual(output, [pointGeometry]);
    t.end();
});
