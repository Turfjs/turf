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
const polyWithHole = polygon([[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
    [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]);
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
    const multiFeatureIndexes = [];
    meta.coordEach(multiPoly, (coord, coordIndex, featureIndex, multiFeatureIndex) => {
        coords.push(coord);
        coordIndexes.push(coordIndex);
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
    });
    t.deepEqual(coordIndexes, [0, 1, 2, 3, 4, 5, 6, 7]);
    t.deepEqual(featureIndexes, [0, 0, 0, 0, 0, 0, 0, 0]);
    t.deepEqual(multiFeatureIndexes, [0, 0, 0, 0, 1, 1, 1, 1]);
    t.equal(coords.length, 8);
    t.end();
});

test('coordEach -- FeatureCollection', t => {
    const coords = [];
    const coordIndexes = [];
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    meta.coordEach(fcMixed, (coord, coordIndex, featureIndex, multiFeatureIndex) => {
        coords.push(coord);
        coordIndexes.push(coordIndex);
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
    });
    t.deepEqual(coordIndexes, [0, 1, 2, 3, 4, 5, 6]);
    t.deepEqual(featureIndexes, [0, 1, 1, 2, 2, 2, 2]);
    t.deepEqual(multiFeatureIndexes, [0, 0, 0, 0, 0, 1, 1]);
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
    const multiFeatureIndexes = [];
    meta.flattenEach(fcMixed, (feature, featureIndex, multiFeatureIndex) => {
        features.push(feature);
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
    });
    t.deepEqual(featureIndexes, [0, 1, 2, 2]);
    t.deepEqual(multiFeatureIndexes, [0, 0, 0, 1]);
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
    const multiFeatureIndexes = [];
    meta.flattenReduce(multiLine, (previous, current, featureIndex, multiFeatureIndex) => {
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
        features.push(current);
        return current;
    });
    t.deepEqual(featureIndexes, [0]);
    t.deepEqual(multiFeatureIndexes, [1]);
    t.equal(features.length, 1);
    t.end();
});

test('flattenReduce -- previous-feature+initialValue', t => {
    const features = [];
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    const sum = meta.flattenReduce(multiPt.geometry, (previous, current, featureIndex, multiFeatureIndex) => {
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
        features.push(current);
        return current;
    }, null);
    t.deepEqual(featureIndexes, [0, 0]);
    t.deepEqual(multiFeatureIndexes, [0, 1]);
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
    const multiFeatureIndexes = [];
    const geometryIndexes = [];
    const segmentIndexes = [];
    let total = 0;

    meta.segmentEach(geojsonSegments, (segment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) => {
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
        geometryIndexes.push(geometryIndex);
        segmentIndexes.push(segmentIndex);
        total++;
    });
    t.equal(total, 10, 'total');
    t.deepEqual(featureIndexes, [1, 1, 2, 2, 2, 2, 4, 4, 4, 4], 'segmentEach.featureIndex');
    t.deepEqual(multiFeatureIndexes, [0, 0, 0, 0, 0, 0, 0, 0, 1, 1], 'segmentEach.multiFeatureIndex');
    t.deepEqual(geometryIndexes, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'segmentEach.geometryIndex');
    t.deepEqual(segmentIndexes, [0, 1, 0, 1, 2, 3, 0, 1, 0, 1], 'segmentEach.segmentIndex');
    t.end();
});

test('segmentReduce -- index & subIndex', t => {
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    const geometryIndexes = [];
    const segmentIndexes = [];
    let total = 0;

    meta.segmentReduce(geojsonSegments, (previousValue, segment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) => {
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
        geometryIndexes.push(geometryIndex);
        segmentIndexes.push(segmentIndex);
        total++;
    });
    t.equal(total, 9, 'total');
    t.deepEqual(featureIndexes, [1, 2, 2, 2, 2, 4, 4, 4, 4], 'segmentReduce.featureIndex');
    t.deepEqual(multiFeatureIndexes, [0, 0, 0, 0, 0, 0, 0, 1, 1], 'segmentReduce.multiFeatureIndex');
    t.deepEqual(geometryIndexes, [0, 0, 0, 0, 0, 0, 0, 0, 0], 'segmentReduce.geometryIndex');
    t.deepEqual(segmentIndexes, [1, 0, 1, 2, 3, 0, 1, 0, 1], 'segmentReduce.segmentIndex');
    t.end();
});

test('lineEach -- lineString', t => {
    const line = lineString([[0, 0], [2, 2], [4, 4]]);
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    const lineIndexes = [];
    let total = 0;

    meta.lineEach(line, (currentLine, featureIndex, multiFeatureIndex, lineIndex) => {
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
        lineIndexes.push(lineIndex);
        total++;
    });
    t.equal(total, 1, 'total');
    t.deepEqual(featureIndexes, [0], 'featureIndex');
    t.deepEqual(multiFeatureIndexes, [0], 'multiFeatureIndex');
    t.deepEqual(lineIndexes, [0], 'lineIndex');
    t.end();
});

test('lineEach -- multiLineString', t => {
    const multiLine = multiLineString([
        [[0, 0], [2, 2], [4, 4]],
        [[1, 1], [3, 3], [5, 5]]
    ]);
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    const lineIndexes = [];
    let total = 0;

    meta.lineEach(multiLine, (currentLine, featureIndex, multiFeatureIndex, lineIndex) => {
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
        lineIndexes.push(lineIndex);
        total++;
    });
    t.equal(total, 2, 'total');
    t.deepEqual(featureIndexes, [0, 0], 'featureIndex');
    t.deepEqual(multiFeatureIndexes, [0, 1], 'multiFeatureIndex');
    t.deepEqual(lineIndexes, [0, 0], 'lineIndex');
    t.end();
});

test('lineEach -- multiPolygon', t => {
    const multiPoly = multiPolygon([
        [
            [[12, 48], [2, 41], [24, 38], [12, 48]], // outer
            [[9, 44], [13, 41], [13, 45], [9, 44]] // inner
        ],
        [
            [[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]] // outer
        ]
    ]);
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    const lineIndexes = [];
    let total = 0;

    meta.lineEach(multiPoly, (currentLine, featureIndex, multiFeatureIndex, lineIndex) => {
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
        lineIndexes.push(lineIndex);
        total++;
    });
    t.equal(total, 3, 'total');
    t.deepEqual(featureIndexes, [0, 0, 0], 'featureIndex');
    t.deepEqual(multiFeatureIndexes, [0, 0, 1], 'multiFeatureIndex');
    t.deepEqual(lineIndexes, [0, 1, 0], 'lineIndex');
    t.end();
});

test('lineEach -- featureCollection', t => {
    const line = lineString([[0, 0], [2, 2], [4, 4]]);
    const multiLine = multiLineString([
        [[0, 0], [2, 2], [4, 4]],
        [[1, 1], [3, 3], [5, 5]]
    ]);
    const multiPoly = multiPolygon([
        [
            [[12, 48], [2, 41], [24, 38], [12, 48]], // outer
            [[9, 44], [13, 41], [13, 45], [9, 44]] // inner
        ],
        [
            [[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]] // outer
        ]
    ]);
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    const lineIndexes = [];
    let total = 0;

    meta.lineEach(featureCollection([line, multiLine, multiPoly]), (currentLine, featureIndex, multiFeatureIndex, lineIndex) => {
        featureIndexes.push(featureIndex);
        multiFeatureIndexes.push(multiFeatureIndex);
        lineIndexes.push(lineIndex);
        total++;
    });
    t.equal(total, 6, 'total');
    t.deepEqual(featureIndexes, [0, 1, 1, 2, 2, 2], 'featureIndex');
    t.deepEqual(multiFeatureIndexes, [0, 0, 1, 0, 0, 1], 'multiFeatureIndex');
    t.deepEqual(lineIndexes, [0, 0, 0, 0, 1, 0], 'lineIndex');
    t.end();
});

test('lineReduce -- multiLineString', t => {
    const multiLine = multiLineString([
        [[0, 0], [2, 2], [4, 4]],
        [[1, 1], [3, 3], [5, 5]]
    ]);

    const total = meta.lineReduce(multiLine, previousValue => {
        previousValue++;
        return previousValue;
    }, 0);

    t.equal(total, 2, 'total');
    t.end();
});

test('lineReduce -- multiPolygon', t => {
    const multiPoly = multiPolygon([
        [
            [[12, 48], [2, 41], [24, 38], [12, 48]], // outer
            [[9, 44], [13, 41], [13, 45], [9, 44]]], // inner
        [
            [[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]] // outer
        ]
    ]);

    const total = meta.lineReduce(multiPoly, previousValue => {
        previousValue++;
        return previousValue;
    }, 0);

    t.equal(total, 3, 'total');
    t.end();
});

test('lineEach & lineReduce -- assert', t => {
    const pt = point([0, 0]);
    const multiPt = multiPoint([[0, 0], [10, 10]]);
    meta.lineEach(pt, () => {}); // Point geometry is supported
    meta.lineEach(multiPt, () => {}); // MultiPoint geometry is supported
    meta.lineReduce(pt, () => {}); // Point geometry is supported
    meta.lineReduce(multiPt, () => {}); // MultiPoint geometry is supported
    meta.lineReduce(geomCollection, () => {}); // GeometryCollection is is supported
    meta.lineReduce(featureCollection([lineString([[10, 10], [0, 0]])]), () => {}); // FeatureCollection is is supported
    meta.lineReduce(feature(null), () => {}); // Feature with null geometry is supported
    t.end();
});

test('geomEach -- callback BBox & Id', t => {
    const properties = {foo: 'bar'};
    const bbox = [0, 0, 0, 0];
    const id = 'foo';
    const pt = point([0, 0], properties, bbox, id);

    meta.geomEach(pt, (currentGeometry, featureIndex, currentProperties, currentBBox, currentId) => {
        t.equal(featureIndex, 0, 'featureIndex');
        t.deepEqual(currentProperties, properties, 'currentProperties');
        t.deepEqual(currentBBox, bbox, 'currentBBox');
        t.deepEqual(currentId, id, 'currentId');
    });
    t.end();
});

test('lineEach -- callback BBox & Id', t => {
    const properties = {foo: 'bar'};
    const bbox = [0, 0, 10, 10];
    const id = 'foo';
    const line = lineString([[0, 0], [10, 10]], properties, bbox, id);

    meta.lineEach(line, (currentLine, featureIndex) => {
        t.equal(featureIndex, 0, 'featureIndex');
        t.deepEqual(currentLine.properties, properties, 'currentProperties');
        t.deepEqual(currentLine.bbox, bbox, 'currentBBox');
        t.deepEqual(currentLine.id, id, 'currentId');
    });
    t.end();
});

test('lineEach -- return lineString', t => {
    const properties = {foo: 'bar'};
    const bbox = [0, 0, 10, 10];
    const id = 'foo';
    const line = lineString([[0, 0], [10, 10]], properties, bbox, id);

    meta.lineEach(line, (currentLine) => {
        t.deepEqual(line, currentLine, 'return itself');
    });
    t.end();
});


test('meta.coordEach -- indexes -- PolygonWithHole', t => {
    const coordIndexes = [];
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    const geometryIndexes = [];

    meta.coordEach(polyWithHole, (coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) => {
        coordIndexes.push(coordIndex)
        featureIndexes.push(featureIndex)
        multiFeatureIndexes.push(multiFeatureIndex)
        geometryIndexes.push(geometryIndex)
    });
    t.deepEqual(coordIndexes, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    t.deepEqual(featureIndexes, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    t.deepEqual(multiFeatureIndexes, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    t.deepEqual(geometryIndexes, [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
    t.end();
});

test('meta.lineEach -- indexes -- PolygonWithHole', t => {
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    const geometryIndexes = [];

    meta.lineEach(polyWithHole, (line, featureIndex, multiFeatureIndex, geometryIndex) => {
        featureIndexes.push(featureIndex)
        multiFeatureIndexes.push(multiFeatureIndex)
        geometryIndexes.push(geometryIndex)
    });
    t.deepEqual(featureIndexes, [0, 0]);
    t.deepEqual(multiFeatureIndexes, [0, 0]);
    t.deepEqual(geometryIndexes, [0, 1]);
    t.end();
});

test('meta.segmentEach -- indexes -- PolygonWithHole', t => {
    const featureIndexes = [];
    const multiFeatureIndexes = [];
    const geometryIndexes = [];
    const segmentIndexes = [];

    meta.segmentEach(polyWithHole, (segment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) => {
        featureIndexes.push(featureIndex)
        multiFeatureIndexes.push(multiFeatureIndex)
        geometryIndexes.push(geometryIndex)
        segmentIndexes.push(segmentIndex)
    });

    t.deepEqual(featureIndexes, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
    t.deepEqual(multiFeatureIndexes, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
    t.deepEqual(geometryIndexes, [0, 0, 0, 0, 1, 1, 1, 1, 1]);
    t.deepEqual(segmentIndexes, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    t.end();
});
