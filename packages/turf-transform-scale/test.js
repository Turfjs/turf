const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const invariant = require('@turf/invariant');
const {point, lineString, geometryCollection, featureCollection} = require('@turf/helpers');
const scale = require('./');
const center = require('@turf/center');
const centroid = require('@turf/centroid');
const turfBBox = require('@turf/bbox');
const getCoord = invariant.getCoord;

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('scale', t => {
    for (const {filename, name, geojson} of fixtures) {
        let {factor, origin, mutate} = geojson.properties || {};

    const scaled = scale(geojson, factor, origin, mutate);
        const result = featureCollection([
            colorize(truncate(scaled, 6, 3)),
            geojson,
            markedOrigin(geojson, origin, {'marker-color': '#00F', 'marker-symbol': 'circle'})
        ]);

    if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    }

    t.end();
});

test('scale -- throws', t => {
    const line = lineString([[10, 10], [12, 15]]);

    t.throws(() => scale(null, 1.5), /geojson required/);
    t.throws(() => scale(line, null), /invalid factor/);
    t.throws(() => scale(line, 0), /invalid factor/);
    t.throws(() => scale(line, 1.5, 'foobar'), /invalid origin/);
    t.throws(() => scale(line, 1.5, 2), /invalid origin/);

    t.end();
});

test('scale -- additional params', t => {
    const line = lineString([[10, 10], [12, 15]]);
    const bbox = [-180, -90, 180, 90];

    t.assert(scale(line, 1.5, 'sw'));
    t.assert(scale(line, 1.5, 'se'));
    t.assert(scale(line, 1.5, 'nw'));
    t.assert(scale(line, 1.5, 'ne'));
    t.assert(scale(line, 1.5, 'center'));
    t.assert(scale(line, 1.5, 'centroid'));
    t.assert(scale(line, 1.5, null));
    line.bbox = bbox;
    t.assert(scale(line, 1.5));
    t.end();
});

test('scale -- bbox provided', t => {
    const line = lineString([[10, 10], [12, 15]]);
    line.bbox = [-180, -90, 180, 90];

    t.assert(scale(line, 1.5));
    t.end();
});

test('scale -- mutated input', t => {
    const line = lineString([[10, 10], [12, 15]]);
    const lineBefore = JSON.parse(JSON.stringify(line));

    scale(line, 1.5);
    t.deepEqual(line, lineBefore, 'mutate = undefined - input should NOT be mutated');
    scale(line, 1.5, 'centroid', false);
    t.deepEqual(line, lineBefore, 'mutate = false - input should NOT be mutated');
    scale(line, 1.5, 'centroid', 'nonBoolean');
    t.deepEqual(line, lineBefore, 'non-boolean mutate - input should NOT be mutated');

    scale(line, 1.5, 'centroid', true);
    t.deepEqual(truncate(line, 1), lineString([[9.5, 8.8], [12.5, 16.2]]), 'mutate = true - input should be mutated');
    t.end();
});

test('scale -- geometry support', t => {
    const pt = point([10, 10]);
    const line = lineString([[10, 10], [12, 15]]);

    t.assert(scale(geometryCollection([line.geometry]), 1.5), 'geometryCollection support');
    t.assert(scale(geometryCollection([line.geometry]).geometry, 1.5), 'geometryCollection support');
    t.assert(scale(featureCollection([line]), 1.50), 'featureCollection support');
    t.assert(scale(line.geometry, 1.5), 'geometry line support');
    t.assert(scale(pt.geometry, 1.5), 'geometry point support');
    t.assert(scale(pt, 1.5), 'geometry point support');
    t.assert(scale(pt, 1.5, pt), 'feature point support');
    t.assert(scale(pt, 1.5, pt.geometry), 'geometry point support');
    t.assert(scale(pt, 1.5, pt.geometry.coordinates), 'coordinate point support');

    t.end();
});

// style result
function colorize(geojson) {
    if (geojson.geometry.type === 'Point' || geojson.geometry.type === 'MultiPoint') {
        geojson.properties['marker-color'] = '#F00';
        geojson.properties['marker-symbol'] = 'star';
    } else {
        geojson.properties['stroke'] = '#F00';
        geojson.properties['stroke-width'] = 4;
    }
    return geojson;
}

// define origin, as defined in transform-scale, and style it
function markedOrigin(geojson, origin, properties) {
    // Default params
    if (origin === undefined || origin === null) origin = 'centroid';

    // Input Geometry|Feature<Point>|Array<number>
    if (Array.isArray(origin) || typeof origin === 'object') return point(getCoord(origin), properties);

    // Define BBox
    var bbox = (geojson.bbox) ? geojson.bbox : turfBBox(geojson);
    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];

    switch (origin) {
        case 'sw':
        case 'southwest':
        case 'westsouth':
        case 'bottomleft':
            return point([west, south], properties);
        case 'se':
        case 'southeast':
        case 'eastsouth':
        case 'bottomright':
            return point([east, south], properties);
        case 'nw':
        case 'northwest':
        case 'westnorth':
        case 'topleft':
            return point([west, north], properties);
        case 'ne':
        case 'northeast':
        case 'eastnorth':
        case 'topright':
            return point([east, north], properties);
        case 'center':
            const cr = center(geojson);
            cr.properties = properties;
            cr.properties = properties;
            return cr;
        case undefined:
        case null:
        case 'centroid':
            const cid = centroid(geojson);
            cid.properties = properties;
            return cid;
        default:
            throw new Error('invalid origin');
    }
}
