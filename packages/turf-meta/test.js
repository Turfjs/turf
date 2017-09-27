import test from 'tape';
import {
    point,
    lineString,
    feature,
    polygon,
    multiPoint,
    multiPolygon,
    multiLineString,
    geometryCollection,
    featureCollection
} from '@turf/helpers';
import * as meta from './index';

const pt = point([0, 0], {a: 1});
const pt2 = point([1, 1]);
const line = lineString([[0, 0], [1, 1]]);
const poly = polygon([[[0, 0], [1, 1], [0, 1], [0, 0]]]);
const multiPt = multiPoint([[0, 0], [1, 1]]);
const multiLine = multiLineString([[[0, 0], [1, 1]], [[3, 3], [4, 4]]]);
const multiPoly = multiPolygon([[[[0, 0], [1, 1], [0, 1], [0, 0]]], [[[3, 3], [2, 2], [1, 2], [3, 3]]]]);
const geomCollection = geometryCollection([pt.geometry, line.geometry, multiLine.geometry], {a: 0});
const fcNull = featureCollection([feature(null), feature(null)]);
const fcMixed = featureCollection([
    point([0, 0]),
    lineString([[1, 1], [2, 2]]),
    multiLineString([[[1, 1], [0, 0]], [[4, 4], [5, 5]]])
]);

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
    collection(pt).forEach(input => {
        meta.propEach(input, (prop, i) => {
            t.deepEqual(prop, {a: 1});
            t.equal(i, 0);
        });
    });
    t.end();
});

test('coordEach -- Point', t => {
    featureAndCollection(pt.geometry).forEach(input => {
        meta.coordEach(input, (coord, index) => {
            t.deepEqual(coord, [0, 0]);
            t.equal(index, 0);
        });
    });
    t.end();
});

test('coordEach -- LineString', t => {
    featureAndCollection(line.geometry).forEach(input => {
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

test('coordEach -- Polygon', t => {
    featureAndCollection(poly.geometry).forEach(input => {
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

test('coordEach -- Polygon excludeWrapCoord', t => {
    featureAndCollection(poly.geometry).forEach(input => {
        const output = [];
        let lastIndex;
        meta.coordEach(input, (coord, index) => {
            output.push(coord);
            lastIndex = index;
        }, true);
        t.equal(lastIndex, 2);
    });
    t.end();
});

test('coordEach -- MultiPolygon', t => {
    const coords = [];
    const coordIndexes = [];
    const featureIndexes = [];
    const featureSubIndexes = [];
    meta.coordEach(multiPoly, (coord, coordIndex, featureIndex, featureSubIndex) => {
        coords.push(coord);
        coordIndexes.push(coordIndex);
        featureIndexes.push(featureIndex);
        featureSubIndexes.push(featureSubIndex);
    });
    t.deepEqual(coordIndexes, [0, 1, 2, 3, 4, 5, 6, 7]);
    t.deepEqual(featureIndexes, [0, 0, 0, 0, 0, 0, 0, 0]);
    t.deepEqual(featureSubIndexes, [0, 0, 0, 0, 1, 1, 1, 1]);
    t.equal(coords.length, 8);
    t.end();
});

test('coordEach -- FeatureCollection', t => {
    const coords = [];
    const coordIndexes = [];
    const featureIndexes = [];
    const featureSubIndexes = [];
    meta.coordEach(fcMixed, (coord, coordIndex, featureIndex, featureSubIndex) => {
        coords.push(coord);
        coordIndexes.push(coordIndex);
        featureIndexes.push(featureIndex);
        featureSubIndexes.push(featureSubIndex);
    });
    t.deepEqual(coordIndexes, [0, 1, 2, 3, 4, 5, 6]);
    t.deepEqual(featureIndexes, [0, 1, 1, 2, 2, 2, 2]);
    t.deepEqual(featureSubIndexes, [0, 0, 0, 0, 0, 1, 1]);
    t.equal(coords.length, 7);
    t.end();
});

test('coordReduce -- initialValue', t => {
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

test('Array.reduce() -- initialValue', t => {
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

test('coordReduce -- previous-coordinates', t => {
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

test('Array.reduce() -- previous-coordinates', t => {
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


test('coordReduce -- previous-coordinates+initialValue', t => {
    let lastIndex;
    const coords = [];
    meta.coordReduce(line, (previousCoords, currentCoords, index) => {
        lastIndex = index;
        coords.push(currentCoords);
        return currentCoords;
    }, line.geometry.coordinates[0]);
    t.equal(lastIndex, 1);
    t.equal(coords.length, 2);
    t.end();
});

test('Array.reduce() -- previous-coordinates+initialValue', t => {
    let lastIndex;
    const coords = [];
    line.geometry.coordinates.reduce((previousCoords, currentCoords, index) => {
        lastIndex = index;
        coords.push(currentCoords);
        return currentCoords;
    }, line[0]);
    t.equal(lastIndex, 1);
    t.equal(coords.length, 2);
    t.end();
});

test('unknown', t => {
    t.throws(function () {
        meta.coordEach({});
    });
    t.end();
});

test('geomEach -- GeometryCollection', t => {
    featureAndCollection(geomCollection.geometry).forEach(input => {
        const output = [];
        meta.geomEach(input, geom => {
            output.push(geom);
        });
        t.deepEqual(output, geomCollection.geometry.geometries);
    });
    t.end();
});

test('geomEach -- bare-GeometryCollection', t => {
    const output = [];
    meta.geomEach(geomCollection, geom => {
        output.push(geom);
    });
    t.deepEqual(output, geomCollection.geometry.geometries);
    t.end();
});

test('geomEach -- bare-pointGeometry', t => {
    const output = [];
    meta.geomEach(pt.geometry, geom => {
        output.push(geom);
    });
    t.deepEqual(output, [pt.geometry]);
    t.end();
});

test('geomEach -- bare-pointFeature', t => {
    const output = [];
    meta.geomEach(pt, geom => {
        output.push(geom);
    });
    t.deepEqual(output, [pt.geometry]);
    t.end();
});

test('geomEach -- multiGeometryFeature-properties', t => {
    let lastProperties;
    meta.geomEach(geomCollection, (geom, index, properties) => {
        lastProperties = properties;
    });
    t.deepEqual(lastProperties, geomCollection.properties);
    t.end();
});

test('flattenEach -- MultiPoint', t => {
    featureAndCollection(multiPt.geometry).forEach(input => {
        const output = [];
        meta.flattenEach(input, feature => {
            output.push(feature.geometry);
        });
        t.deepEqual(output, [pt.geometry, pt2.geometry]);
    });
    t.end();
});

test('flattenEach -- Mixed FeatureCollection', t => {
    const features = [];
    const featureIndexes = [];
    const featureSubIndexes = [];
    meta.flattenEach(fcMixed, (feature, featureIndex, featureSubIndex) => {
        features.push(feature);
        featureIndexes.push(featureIndex);
        featureSubIndexes.push(featureSubIndex);
    });
    t.deepEqual(featureIndexes, [0, 1, 2, 2]);
    t.deepEqual(featureSubIndexes, [0, 0, 0, 1]);
    t.equal(features.length, 4);
    t.end();
});

test('flattenEach -- Point-properties', t => {
    collection(pt).forEach(input => {
        let lastProperties;
        meta.flattenEach(input, feature => {
            lastProperties = feature.properties;
        });
        t.deepEqual(lastProperties, pt.properties);
    });
    t.end();
});

test('flattenEach -- multiGeometryFeature-properties', t => {
    collection(geomCollection).forEach(input => {
        let lastProperties;
        meta.flattenEach(input, feature => {
            lastProperties = feature.properties;
        });
        t.deepEqual(lastProperties, geomCollection.properties);
    });
    t.end();
});

test('flattenReduce -- initialValue', t => {
    let lastIndex;
    let lastSubIndex;
    const sum = meta.flattenReduce(multiPt.geometry, (previous, current, index, subIndex) => {
        lastIndex = index;
        lastSubIndex = subIndex;
        return previous + current.geometry.coordinates[0];
    }, 0);
    t.equal(lastIndex, 0);
    t.equal(lastSubIndex, 1);
    t.equal(sum, 1);
    t.end();
});

test('flattenReduce -- previous-feature', t => {
    const features = [];
    const featureIndexes = [];
    const featureSubIndexes = [];
    meta.flattenReduce(multiLine, (previous, current, featureIndex, featureSubIndex) => {
        featureIndexes.push(featureIndex);
        featureSubIndexes.push(featureSubIndex);
        features.push(current);
        return current;
    });
    t.deepEqual(featureIndexes, [0]);
    t.deepEqual(featureSubIndexes, [1]);
    t.equal(features.length, 1);
    t.end();
});

test('flattenReduce -- previous-feature+initialValue', t => {
    const features = [];
    const featureIndexes = [];
    const featureSubIndexes = [];
    const sum = meta.flattenReduce(multiPt.geometry, (previous, current, featureIndex, featureSubIndex) => {
        featureIndexes.push(featureIndex);
        featureSubIndexes.push(featureSubIndex);
        features.push(current);
        return current;
    }, null);
    t.deepEqual(featureIndexes, [0, 0]);
    t.deepEqual(featureSubIndexes, [0, 1]);
    t.equal(features.length, 2);
    t.deepEqual(sum, features[features.length - 1]);
    t.end();
});

// https://github.com/Turfjs/turf/issues/853
test('null geometries', t => {
    // Each operations
    meta.featureEach(fcNull, feature => t.equal(feature.geometry, null, 'featureEach'));
    meta.geomEach(fcNull, geometry => t.equal(geometry, null), 'geomEach');
    meta.flattenEach(fcNull, feature => t.equal(feature.geometry, null, 'flattenEach'));
    meta.coordEach(fcNull, () => t.fail('no coordinates should be found'));

    // Reduce operations
    /* eslint-disable no-return-assign */
    t.equal(meta.featureReduce(fcNull, prev => prev += 1, 0), 2, 'featureReduce');
    t.equal(meta.geomReduce(fcNull, prev => prev += 1, 0), 2, 'geomReduce');
    t.equal(meta.flattenReduce(fcNull, prev => prev += 1, 0), 2, 'flattenReduce');
    t.equal(meta.coordReduce(fcNull, prev => prev += 1, 0), 0, 'coordReduce');
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
    meta.segmentEach(poly.geometry, currentSegment => {
        segments.push(currentSegment);
        total++;
    });
    t.equal(segments[0].geometry.coordinates.length, 2);
    t.equal(total, 3);
    t.end();
});

test('segmentEach -- MultiPoint', t => {
    const segments = [];
    let total = 0;
    meta.segmentEach(multiPt.geometry, currentSegment => {
        segments.push(currentSegment);
        total++;
    });
    t.equal(total, 0); // No segments are created from MultiPoint geometry
    t.end();
});

test('segmentReduce', t => {
    const segments = [];
    const total = meta.segmentReduce(poly.geometry, (previousValue, currentSegment) => {
        segments.push(currentSegment);
        previousValue++;
        return previousValue;
    }, 0);
    t.equal(segments[0].geometry.coordinates.length, 2);
    t.equal(total, 3);
    t.end();
});

test('segmentReduce -- no initialValue', t => {
    const segments = [];
    var total = 0;
    meta.segmentReduce(poly.geometry, (previousValue, currentSegment) => {
        segments.push(currentSegment);
        total++;
    });
    t.equal(segments[0].geometry.coordinates.length, 2);
    t.equal(total, 2);
    t.end();
});

const geojsonSegments = featureCollection([
    point([0, 1]), // ignored
    lineString([[0, 0], [2, 2], [4, 4]]),
    polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]]),
    point([0, 1]), // ignored
    multiLineString([
        [[0, 0], [2, 2], [4, 4]],
        [[0, 0], [2, 2], [4, 4]]
    ])
]);

test('segmentEach -- index & subIndex', t => {
    const featureIndexes = [];
    const featureSubIndexes = [];
    const segmentIndexes = [];
    let total = 0;

    meta.segmentEach(geojsonSegments, (segment, featureIndex, featureSubIndex, segmentIndex) => {
        featureIndexes.push(featureIndex);
        featureSubIndexes.push(featureSubIndex);
        segmentIndexes.push(segmentIndex);
        total++;
    });
    t.equal(total, 10, 'total');
    t.deepEqual(featureIndexes, [1, 1, 2, 2, 2, 2, 4, 4, 4, 4], 'segmentEach.featureIndex');
    t.deepEqual(featureSubIndexes, [0, 0, 0, 0, 0, 0, 0, 0, 1, 1], 'segmentEach.featureSubIndex');
    t.deepEqual(segmentIndexes, [0, 1, 0, 1, 2, 3, 0, 1, 0, 1], 'segmentEach.segmentIndex');
    t.end();
});

test('segmentReduce -- index & subIndex', t => {
    const featureIndexes = [];
    const featureSubIndexes = [];
    const segmentIndexes = [];
    let total = 0;

    meta.segmentReduce(geojsonSegments, (previousValue, segment, featureIndex, featureSubIndex, segmentIndex) => {
        featureIndexes.push(featureIndex);
        featureSubIndexes.push(featureSubIndex);
        segmentIndexes.push(segmentIndex);
        total++;
    });
    t.equal(total, 9, 'total');
    t.deepEqual(segmentIndexes, [1, 0, 1, 2, 3, 0, 1, 0, 1], 'segmentEach.segmentIndex');
    t.deepEqual(featureIndexes, [1, 2, 2, 2, 2, 4, 4, 4, 4], 'segmentEach.featureIndex');
    t.deepEqual(featureSubIndexes, [0, 0, 0, 0, 0, 0, 0, 1, 1], 'segmentEach.featureSubIndex');
    t.end();
});

test('lineEach -- lineString', t => {
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

test('lineEach -- multiLineString', t => {
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

test('lineEach -- multiPolygon', t => {
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


test('lineReduce -- multiLineString', t => {
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

test('lineReduce -- multiPolygon', t => {
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
    t.throws(() => meta.lineReduce(geomCollection, () => {}), /GeometryCollection is not supported/, 'GeometryCollection is not supported');
    t.throws(() => meta.lineReduce(featureCollection([lineString([[10, 10], [0, 0]])]), () => {}), /FeatureCollection is not supported/, 'FeatureCollection is not supported');
    t.throws(() => meta.lineReduce(feature(null), () => {}), /geojson must contain coordinates/, 'geojson must contain coordinates');
    t.end();
});
