const test = require('tape');
const {lineString} = require('@turf/helpers');
const meta = require('./');

const pointGeometry = {
    type: 'Point',
    coordinates: [0, 0]
};

const point2Geometry = {
    type: 'Point',
    coordinates: [1, 1]
};

const lineStringGeometry = {
    type: 'LineString',
    coordinates: [[0, 0], [1, 1]]
};

const polygonGeometry = {
    type: 'Polygon',
    coordinates: [[[0, 0], [1, 1], [0, 1], [0, 0]]]
};

const multiPointGeometry = {
    type: 'MultiPoint',
    coordinates: [pointGeometry.coordinates, point2Geometry.coordinates]
};

const multiPolygonGeometry = {
    type: 'MultiPolygon',
    coordinates: [[[[0, 0], [1, 1], [0, 1], [0, 0]]]]
};

const geometryCollection = {
    type: 'GeometryCollection',
    geometries: [pointGeometry, lineStringGeometry]
};

const multiGeometryCollection = {
    type: 'GeometryCollection',
    geometries: [lineStringGeometry, multiPointGeometry]
};

const pointFeature = {
    type: 'Feature',
    properties: {a: 1},
    geometry: pointGeometry
};

const multiGeometryFeature = {
    type: 'Feature',
    properties: {a: 1},
    geometry: multiGeometryCollection
};

function collection(feature) {
    const featureCollection = {
        type: 'FeatureCollection',
        features: [feature]
    };

    return [feature, featureCollection];
}

function featureAndCollection(geometry) {
    const feature = {
        type: 'Feature',
        geometry: geometry,
        properties: {a: 1}
    };

    const featureCollection = {
        type: 'FeatureCollection',
        features: [feature]
    };

    return [geometry, feature, featureCollection];
}


test('propEach', t => {
    collection(pointFeature).forEach(input => {
        meta.propEach(input, (prop, i) => {
            t.deepEqual(prop, {a: 1});
            t.equal(i, 0);
        });
    });
    t.end();
});

test('coordEach#Point', t => {
    featureAndCollection(pointGeometry).forEach(input => {
        meta.coordEach(input, (coord, index) => {
            t.deepEqual(coord, [0, 0]);
            t.equal(index, 0);
        });
    });
    t.end();
});

test('coordEach#LineString', t => {
    featureAndCollection(lineStringGeometry).forEach(input => {
        const output = [];
        let lastIndex;
        meta.coordEach(input, (coord, index) => {
            output.push(coord);
            lastIndex = index;
        });
        t.deepEqual(output, [[0, 0], [1, 1]]);
        t.equal(lastIndex, 1);
    });
    t.end();
});

test('coordEach#Polygon', t => {
    featureAndCollection(polygonGeometry).forEach(input => {
        const output = [];
        let lastIndex;
        meta.coordEach(input, (coord, index) => {
            output.push(coord);
            lastIndex = index;
        });
        t.deepEqual(output, [[0, 0], [1, 1], [0, 1], [0, 0]]);
        t.equal(lastIndex, 3);
    });
    t.end();
});

test('coordEach#Polygon excludeWrapCoord', t => {
    featureAndCollection(polygonGeometry).forEach(input => {
        const output = [];
        let lastIndex;
        meta.coordEach(input, (coord, index) => {
            output.push(coord);
            lastIndex = index;
        }, true);
        t.deepEqual(output, [[0, 0], [1, 1], [0, 1]]);
        t.equal(lastIndex, 2);
    });
    t.end();
});



test('coordEach#MultiPolygon', t => {
    featureAndCollection(multiPolygonGeometry).forEach(input => {
        const output = [];
        let lastIndex;
        meta.coordEach(input, (coord, index) => {
            output.push(coord);
            lastIndex = index;
        });
        t.deepEqual(output, [[0, 0], [1, 1], [0, 1], [0, 0]]);
        t.equal(lastIndex, 3);
    });
    t.end();
});

test('coordEach#GeometryCollection', t => {
    featureAndCollection(geometryCollection).forEach(input => {
        const output = [];
        let lastIndex;
        meta.coordEach(input, (coord, index) => {
            output.push(coord);
            lastIndex = index;
        });
        t.deepEqual(output, [[0, 0], [0, 0], [1, 1]]);
        t.equal(lastIndex, 2);
    });
    t.end();
});

test('coordReduce#initialValue', t => {
    let lastIndex;
    const line = lineString([[126, -11], [129, -21], [135, -31]]);
    const sum = meta.coordReduce(line, (previous, currentCoords, index) => {
        lastIndex = index;
        return previous + currentCoords[0];
    }, 0);
    t.equal(lastIndex, 2);
    t.equal(sum, 390);
    t.end();
});

test('Array.reduce()#initialValue', t => {
    let lastIndex;
    const line = [[126, -11], [129, -21], [135, -31]];
    const sum = line.reduce((previous, currentCoords, index) => {
        lastIndex = index;
        return previous + currentCoords[0];
    }, 0);
    t.equal(lastIndex, 2);
    t.equal(sum, 390);
    t.end();
});

test('coordReduce#previous-coordinates', t => {
    let lastIndex;
    const coords = [];
    const line = lineString([[126, -11], [129, -21], [135, -31]]);
    meta.coordReduce(line, (previousCoords, currentCoords, index) => {
        lastIndex = index;
        coords.push(currentCoords);
        return currentCoords;
    });
    t.equal(lastIndex, 2);
    t.equal(coords.length, 2);
    t.end();
});

test('Array.reduce()#previous-coordinates', t => {
    let lastIndex;
    const coords = [];
    const line = [[126, -11], [129, -21], [135, -31]];
    line.reduce((previousCoords, currentCoords, index) => {
        lastIndex = index;
        coords.push(currentCoords);
        return currentCoords;
    });
    t.equal(lastIndex, 2);
    t.equal(coords.length, 2);
    t.end();
});


test('coordReduce#previous-coordinates+initialValue', t => {
    let lastIndex;
    const coords = [];
    const line = lineString([[126, -11], [129, -21], [135, -31]]);
    meta.coordReduce(line, (previousCoords, currentCoords, index) => {
        lastIndex = index;
        coords.push(currentCoords);
        return currentCoords;
    }, line.geometry.coordinates[0]);
    t.equal(lastIndex, 2);
    t.equal(coords.length, 3);
    t.end();
});

test('Array.reduce()#previous-coordinates+initialValue', t => {
    let lastIndex;
    const coords = [];
    const line = [[126, -11], [129, -21], [135, -31]];
    line.reduce((previousCoords, currentCoords, index) => {
        lastIndex = index;
        coords.push(currentCoords);
        return currentCoords;
    }, line[0]);
    t.equal(lastIndex, 2);
    t.equal(coords.length, 3);
    t.end();
});

test('unknown', t => {
    t.throws(function () {
        meta.coordEach({});
    });
    t.end();
});

test('geomEach#GeometryCollection', t => {
    featureAndCollection(geometryCollection).forEach(input => {
        const output = [];
        meta.geomEach(input, geom => {
            output.push(geom);
        });
        t.deepEqual(output, geometryCollection.geometries);
    });
    t.end();
});

test('geomEach#bare-GeometryCollection', t => {
    const output = [];
    meta.geomEach(geometryCollection, geom => {
        output.push(geom);
    });
    t.deepEqual(output, geometryCollection.geometries);
    t.end();
});

test('geomEach#bare-pointGeometry', t => {
    const output = [];
    meta.geomEach(pointGeometry, geom => {
        output.push(geom);
    });
    t.deepEqual(output, [pointGeometry]);
    t.end();
});

test('geomEach#bare-pointFeature', t => {
    const output = [];
    meta.geomEach(pointFeature, geom => {
        output.push(geom);
    });
    t.deepEqual(output, [pointGeometry]);
    t.end();
});

test('geomEach#multiGeometryFeature-properties', t => {
    let lastProperties;
    meta.geomEach(multiGeometryFeature, (geom, index, properties) => {
        lastProperties = properties;
    });
    t.deepEqual(lastProperties, multiGeometryFeature.properties);
    t.end();
});

test('flattenEach#MultiPoint', t => {
    featureAndCollection(multiPointGeometry).forEach(input => {
        const output = [];
        meta.flattenEach(input, feature => {
            output.push(feature.geometry);
        });
        t.deepEqual(output, [pointGeometry, point2Geometry]);
    });
    t.end();
});

test('flattenEach#MultiGeometryCollection', t => {
    featureAndCollection(multiGeometryCollection).forEach(input => {
        const output = [];
        meta.flattenEach(input, feature => {
            output.push(feature.geometry);
        });
        t.deepEqual(output, [lineStringGeometry, pointGeometry, point2Geometry]);
    });
    t.end();
});

test('flattenEach#Point-properties', t => {
    collection(pointFeature).forEach(input => {
        let lastProperties;
        meta.flattenEach(input, feature => {
            lastProperties = feature.properties;
        });
        t.deepEqual(lastProperties, pointFeature.properties);
    });
    t.end();
});

test('flattenEach#multiGeometryFeature-properties', t => {
    collection(multiGeometryFeature).forEach(input => {
        let lastProperties;
        meta.flattenEach(input, feature => {
            lastProperties = feature.properties;
        });
        t.deepEqual(lastProperties, multiGeometryFeature.properties);
    });
    t.end();
});

test('flattenReduce#initialValue', t => {
    let lastIndex;
    let lastSubIndex;
    const sum = meta.flattenReduce(multiPointGeometry, (previous, current, index, subIndex) => {
        lastIndex = index;
        lastSubIndex = subIndex;
        return previous + current.geometry.coordinates[0];
    }, 0);
    t.equal(lastIndex, 0);
    t.equal(lastSubIndex, 1);
    t.equal(sum, 1);
    t.end();
});

test('flattenReduce#previous-feature', t => {
    const features = [];
    let lastIndex;
    let lastSubIndex;
    meta.flattenReduce(multiGeometryCollection, (previous, current, index, subIndex) => {
        lastIndex = index;
        lastSubIndex = subIndex;
        features.push(current);
        return current;
    });
    t.equal(lastIndex, 1);
    t.equal(lastSubIndex, 1);
    t.equal(features.length, 2);
    t.end();
});

test('flattenReduce#previous-feature+initialValue', t => {
    const features = [];
    let lastIndex;
    let lastSubIndex;
    const sum = meta.flattenReduce(multiPointGeometry, (previous, current, index, subIndex) => {
        lastIndex = index;
        lastSubIndex = subIndex;
        features.push(current);
        return current;
    }, pointFeature);
    t.equal(lastIndex, 0);
    t.equal(lastSubIndex, 1);
    t.equal(features.length, 2);
    t.deepEqual(sum, features[features.length - 1]);
    t.end();
});
