const test = require('tape');
const {point, lineString, polygon, featureCollection, geometryCollection} = require('@turf/helpers');
const {coordEach} = require('@turf/meta');
const clone = require('./');


test('turf-clone', t => {
    // Define Features
    const pt = point([0, 20]);
    const line = lineString([[10, 40], [0, 20]]);
    const poly = polygon([[[10, 40], [0, 20], [20, 0], [10, 40]]]);
    const fc = featureCollection([
        point([0, 20]),
        lineString([[10, 40], [0, 20]]),
        polygon([[[10, 40], [0, 20], [20, 0], [10, 40]]])
    ]);
    const gc = geometryCollection([
        point([0, 20]).geometry,
        lineString([[10, 40], [0, 20]]).geometry,
        polygon([[[10, 40], [0, 20], [20, 0], [10, 40]]]).geometry
    ]).geometry;

    // Clone Features
    const ptCloned = clone(pt);
    const lineCloned = clone(line);
    const polyCloned = clone(poly, true);
    const fcCloned = clone(fc);
    const gcCloned = clone(gc);

    // Apply Mutation
    ptCloned.geometry.coordinates.reverse();
    lineCloned.geometry.coordinates.reverse();
    polyCloned.geometry.coordinates.reverse();
    coordEach(fcCloned, coord => coord.reverse());
    coordEach(gcCloned, coord => coord.reverse());

    // Original Geometries should not be mutated
    t.deepEqual(pt.geometry.coordinates, [0, 20], 'point');
    t.deepEqual(line.geometry.coordinates, [[10, 40], [0, 20]], 'lineString');
    t.deepEqual(poly.geometry.coordinates, [[[10, 40], [0, 20], [20, 0], [10, 40]]], 'polygon');

    // Feature Collection
    t.deepEqual(fc.features[0].geometry.coordinates, [0, 20], 'fc - point');
    t.deepEqual(fc.features[1].geometry.coordinates, [[10, 40], [0, 20]], 'fc - lineString');
    t.deepEqual(fc.features[2].geometry.coordinates, [[[10, 40], [0, 20], [20, 0], [10, 40]]], 'fc - polygon');

    // Geometry Collection
    t.deepEqual(gc.geometries[0].coordinates, [0, 20], 'gc - point');
    t.deepEqual(gc.geometries[1].coordinates, [[10, 40], [0, 20]], 'gc - lineString');
    t.deepEqual(gc.geometries[2].coordinates, [[[10, 40], [0, 20], [20, 0], [10, 40]]], 'gc - polygon');
    t.end();
});

test('turf-clone -- throws', t => {
    const pt = point([0, 20]);

    t.throws(() => clone(), /geojson is required/);
    t.throws(() => clone(pt, 'foo'), /cloneAll must be a Boolean/);
    t.end();
});

test('turf-clone -- optional properties', t => {
    const pt = point([0, 20]);
    pt.properties = undefined;
    pt.id = 300;
    pt.bbox = [0, 20, 0, 20];

    const ptCloned = clone(pt);
    t.deepEqual(ptCloned.bbox, [0, 20, 0, 20]);
    t.equal(ptCloned.id, 300);
    t.end();
});

test('turf-clone -- Geometry Objects', t => {
    const pt = point([0, 20]).geometry;
    const line = lineString([[10, 40], [0, 20]]).geometry;
    const poly = polygon([[[10, 40], [0, 20], [20, 0], [10, 40]]]).geometry;

    const ptCloned = clone(pt);
    const lineCloned = clone(line);
    const polyCloned = clone(poly);

    ptCloned.coordinates.reverse();
    lineCloned.coordinates.reverse();
    polyCloned.coordinates.reverse();

    t.deepEqual(pt.coordinates, [0, 20], 'geometry point');
    t.deepEqual(line.coordinates, [[10, 40], [0, 20]], 'geometry line');
    t.deepEqual(poly.coordinates, [[[10, 40], [0, 20], [20, 0], [10, 40]]], 'geometry polygon');
    t.end();
});
