const test = require('tape');
const {point, lineString, feature, polygon, multiPoint, multiPolygon, multiLineString, featureCollection} = require('@turf/helpers');
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

const multiLineStringGeometry = {
    type: 'MultiLineString',
    coordinates: [lineStringGeometry.coordinates]
};

const multiPolygonGeometry = {
    type: 'MultiPolygon',
    coordinates: [polygonGeometry.coordinates]
};

const geometryCollection = {
    type: 'GeometryCollection',
    geometries: [pointGeometry, lineStringGeometry]
};

const multiGeometryCollection = {
    type: 'GeometryCollection',
    geometries: [lineStringGeometry,
                 multiLineStringGeometry,
                 multiPolygonGeometry,
                 multiPointGeometry]
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
        t.deepEqual(output, [lineStringGeometry,
                             lineStringGeometry,
                             polygonGeometry,
                             pointGeometry,
                             point2Geometry]);
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
    t.equal(lastIndex, 3);
    t.equal(lastSubIndex, 1);
    t.equal(features.length, 4);
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

// https://github.com/Turfjs/turf/issues/853
test('null geometries', t => {
    const fc = featureCollection([
        feature(null),
        feature(null)
    ]);

    // Each operations
    meta.featureEach(fc, feature => t.equal(feature.geometry, null, 'featureEach'));
    meta.geomEach(fc, geometry => t.equal(geometry, null), 'geomEach');
    meta.flattenEach(fc, feature => t.equal(feature.geometry, null, 'flattenEach'));
    meta.coordEach(fc, () => t.fail('no coordinates should be found'));

    // Reduce operations
    /* eslint-disable no-return-assign */
    t.equal(meta.featureReduce(fc, prev => prev += 1, 0), 2, 'featureReduce');
    t.equal(meta.geomReduce(fc, prev => prev += 1, 0), 2, 'geomReduce');
    t.equal(meta.flattenReduce(fc, prev => prev += 1, 0), 2, 'flattenReduce');
    t.equal(meta.coordReduce(fc, prev => prev += 1, 0), 0, 'coordReduce');
    /* eslint-enable no-return-assign */
    t.end();
});

test('null geometries -- index', t => {
    const fc = featureCollection([
        feature(null), // index 0
        point([0, 0]), // index 1
        feature(null), // index 2
        lineString([[1, 1], [0, 0]]) // index 3
    ]);
    t.deepEqual(meta.coordReduce(fc, (prev, coords, coordIndex) => prev.concat(coordIndex), []), [0, 1, 2], 'coordReduce');
    t.deepEqual(meta.geomReduce(fc, (prev, geom, featureIndex) => prev.concat(featureIndex), []), [0, 1, 2, 3], 'geomReduce');
    t.deepEqual(meta.flattenReduce(fc, (prev, feature, featureIndex) => prev.concat(featureIndex), []), [0, 1, 2, 3], 'flattenReduce');
    t.end();
});

test('segmentEach', t => {
    const segments = [];
    let total = 0;
    meta.segmentEach(polygonGeometry, currentSegment => {
        segments.push(currentSegment);
        total++;
    });
    t.equal(segments[0].geometry.coordinates.length, 2);
    t.equal(total, 3);
    t.end();
});

test('segmentEach#MultiPoint', t => {
    const segments = [];
    let total = 0;
    meta.segmentEach(multiPointGeometry, currentSegment => {
        segments.push(currentSegment);
        total++;
    });
    t.equal(total, 0); // No segments are created from MultiPoint geometry
    t.end();
});

test('segmentReduce', t => {
    const segments = [];
    const total = meta.segmentReduce(polygonGeometry, (previousValue, currentSegment) => {
        segments.push(currentSegment);
        previousValue++;
        return previousValue;
    }, 0);
    t.equal(segments[0].geometry.coordinates.length, 2);
    t.equal(total, 3);
    t.end();
});

const geojsonSegments = featureCollection([
    point([0, 1]),
    lineString([[0, 0], [2, 2], [4, 4]]), // subIndex = 0, 1
    polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]]), // subIndex = 0, 1, 2, 3
    point([0, 1]),
    lineString([[0, 0], [2, 2], [4, 4]]) // subIndex = 0, 1
]);

test('segmentEach -- index & subIndex', t => {
    const index = [];
    const subIndex = [];
    let total = 0;

    meta.segmentEach(geojsonSegments, (segment, featureIndex, featureSubIndex) => {
        index.push(featureIndex);
        subIndex.push(featureSubIndex);
        total++;
    });
    t.equal(total, 8, 'total');
    t.deepEqual(index, [1, 1, 2, 2, 2, 2, 4, 4], 'index');
    t.deepEqual(subIndex, [0, 1, 0, 1, 2, 3, 0, 1], 'subIndex');
    t.end();
});

test('segmentReduce -- index & subIndex', t => {
    const index = [];
    const subIndex = [];

    const total = meta.segmentReduce(geojsonSegments, (previousValue, segment, featureIndex, featureSubIndex) => {
        index.push(featureIndex);
        subIndex.push(featureSubIndex);
        previousValue++;
        return previousValue;
    }, 0);

    t.equal(total, 8, 'total');
    t.deepEqual(index, [1, 1, 2, 2, 2, 2, 4, 4], 'index');
    t.deepEqual(subIndex, [0, 1, 0, 1, 2, 3, 0, 1], 'subIndex');
    t.end();
});

const geojsonCoords = featureCollection([
    point([0, 1]),
    lineString([[0, 0], [2, 2], [4, 4]]),
    point([2, 2])
]);

test('coordEach -- index & subIndex', t => {
    const coordIndexes = [];
    const featureIndexes = [];
    const featureSubIndexes = [];
    let total = 0;

    meta.coordEach(geojsonCoords, (coord, coordIndex, featureIndex, featureSubIndex) => {
        coordIndexes.push(coordIndex);
        featureIndexes.push(featureIndex);
        featureSubIndexes.push(featureSubIndex);
        total++;
    });
    t.equal(total, 5, 'total');
    t.deepEqual(coordIndexes, [0, 1, 2, 3, 4], 'coordIndex');
    t.deepEqual(featureIndexes, [0, 1, 1, 1, 2], 'featureIndex');
    t.deepEqual(featureSubIndexes, [0, 0, 1, 2, 0], 'featureSubIndex');
    t.end();
});

test('coordEach -- index & subIndex', t => {
    const coordIndexes = [];
    const featureIndexes = [];
    const featureSubIndexes = [];

    const total = meta.coordReduce(geojsonCoords, (previousValue, coord, coordIndex, featureIndex, featureSubIndex) => {
        coordIndexes.push(coordIndex);
        featureIndexes.push(featureIndex);
        featureSubIndexes.push(featureSubIndex);
        previousValue++;
        return previousValue;
    }, 0);

    t.equal(total, 5);
    t.deepEqual(coordIndexes, [0, 1, 2, 3, 4], 'coordIndex');
    t.deepEqual(featureIndexes, [0, 1, 1, 1, 2], 'featureIndex');
    t.deepEqual(featureSubIndexes, [0, 0, 1, 2, 0], 'featureSubIndex');
    t.end();
});


test('lineEach#lineString', t => {
    const l = lineString([[0, 0], [2, 2], [4, 4]]);
    const index = [];
    const subIndex = [];
    let total = 0;

    meta.lineEach(l, (line, lineIndex, lineSubIndex) => {
        index.push(lineIndex);
        subIndex.push(lineSubIndex);
        total++;
    });
    t.equal(total, 1, 'total');
    t.deepEqual(index, [0], 'index');
    t.deepEqual(subIndex, [0], 'subIndex');
    t.end();
});

test('lineEach#multiLineString', t => {
    const mls = multiLineString([[[0, 0], [2, 2], [4, 4]], [[1, 1], [3, 3], [5, 5]]]);
    const index = [];
    const subIndex = [];
    let total = 0;

    meta.lineEach(mls, (line, lineIndex, lineSubIndex) => {
        index.push(lineIndex);
        subIndex.push(lineSubIndex);
        total++;
    });
    t.equal(total, 2, 'total');
    t.deepEqual(index, [0, 1], 'index');
    t.deepEqual(subIndex, [0, 1], 'subIndex');
    t.end();
});

test('lineEach#multiPolygon', t => {
    const mp = multiPolygon([
        [[[12, 48], [2, 41], [24, 38], [12, 48]], [[9, 44], [13, 41], [13, 45], [9, 44]]],
        [[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]]
    ]);
    const index = [];
    const subIndex = [];
    let total = 0;

    meta.lineEach(mp, (ring, ringIndex, ringSubIndex) => {
        index.push(ringIndex);
        subIndex.push(ringSubIndex);
        total++;
    });
    t.equal(total, 3, 'total');
    t.deepEqual(index, [0, 1, 0], 'index');
    t.deepEqual(subIndex, [0, 0, 1], 'subIndex');
    t.end();
});


test('lineReduce#multiLineString', t => {
    const mls = multiLineString([[[0, 0], [2, 2], [4, 4]], [[1, 1], [3, 3], [5, 5]]]);
    const index = [];
    const subIndex = [];

    const total = meta.lineReduce(mls, (previousValue, line, lineIndex, lineSubIndex) => {
        index.push(lineIndex);
        subIndex.push(lineSubIndex);
        previousValue++;
        return previousValue;
    }, 1);

    t.equal(total, 3, 'total');
    t.deepEqual(index, [0, 1], 'index');
    t.deepEqual(subIndex, [0, 1], 'subIndex');
    t.end();
});

test('lineReduce#multiPolygon', t => {
    const mp = multiPolygon([
        [[[12, 48], [2, 41], [24, 38], [12, 48]],  [[9, 44], [13, 41], [13, 45], [9, 44]]],
        [[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]]
    ]);
    const index = [];
    const subIndex = [];

    const total = meta.lineReduce(mp, (previousValue, line, lineIndex, lineSubIndex) => {
        index.push(lineIndex);
        subIndex.push(lineSubIndex);
        previousValue++;
        return previousValue;
    }, 3);

    t.equal(total, 6, 'total');
    t.deepEqual(index, [0, 1, 0], 'index');
    t.deepEqual(subIndex, [0, 0, 1], 'subIndex');
    t.end();
});

test('lineEach & lineReduce -- throws', t => {
    const pt = point([0, 0]);
    const multiPt = multiPoint([[0, 0], [10, 10]]);
    t.throws(() => meta.lineEach(pt, () => {}), /Point geometry not supported/, 'Point geometry not supported');
    t.throws(() => meta.lineEach(multiPt, () => {}), /MultiPoint geometry not supported/, 'MultiPoint geometry not supported');
    t.throws(() => meta.lineReduce(pt, () => {}), /Point geometry not supported/, 'Point geometry not supported');
    t.throws(() => meta.lineReduce(multiPt, () => {}), /MultiPoint geometry not supported/, 'MultiPoint geometry not supported');
    t.throws(() => meta.lineReduce(geometryCollection, () => {}), /GeometryCollection is not supported/, 'GeometryCollection is not supported');
    t.throws(() => meta.lineReduce(featureCollection([lineString([[10, 10], [0, 0]])]), () => {}), /FeatureCollection is not supported/, 'FeatureCollection is not supported');
    t.throws(() => meta.lineReduce(feature(null), () => {}), /geojson must contain coordinates/, 'geojson must contain coordinates');
    t.end();
});
