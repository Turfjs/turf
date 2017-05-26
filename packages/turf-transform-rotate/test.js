const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const centroid = require('@turf/centroid');
const truncate = require('@turf/truncate');
const {getCoord} = require('@turf/invariant');
const {point, lineString, featureCollection, geometryCollection} = require('@turf/helpers');
const rotate = require('./');

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

test('rotate', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const {angle, pivot} = geojson.properties || {};

        const rotated = rotate(geojson, angle, pivot);
        const result = featureCollection([colorize(truncate(rotated, 6, 3)), geojson, makePivot(pivot, geojson)]);

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    }

    t.end();
});

test('rotate -- throws', t => {
    const line = lineString([[10, 10], [12, 15]]);

    t.throws(() => rotate(null, 100), /geojson is required/, 'missing geojson');
    t.throws(() => rotate(line, null), /angle is required/, 'missing angle');
    t.throws(() => rotate(line, 56, 'notApoint'), /coordinates must only contain numbers/, 'invalid pivot');
    t.end();
});

test('rotate -- mutated input', t => {
    const line = lineString([[10, 10], [12, 15]]);
    const lineBefore = JSON.parse(JSON.stringify(line));

    rotate(line, 100);
    t.deepEqual(line, lineBefore, 'input should NOT be mutated');

    rotate(line, 100, undefined, true);
    t.deepEqual(truncate(line, 1), lineString([[8.6, 13.9], [13.3, 11.1]]), 'input should be mutated');
    t.end();
});

test('rotate -- geometry support', t => {
    const line = lineString([[10, 10], [12, 15]]);
    const pt = point([10, 10]);

    t.assert(rotate(geometryCollection([line.geometry]), 100), 'geometryCollection support');
    t.assert(rotate(geometryCollection([line.geometry]).geometry, 100), 'geometryCollection support');
    t.assert(rotate(featureCollection([line]), 100), 'featureCollection support');
    t.assert(rotate(line.geometry, 100), 'geometry line support');
    t.assert(rotate(line.geometry, 100, pt.geometry), 'geometry pt support');
    t.assert(rotate(line.geometry, 100, pt.geometry.coordinates), 'pt coordinate support');
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

function makePivot(pivot, geojson) {
    if (!pivot) {
        const pt = centroid(geojson);
        pt.properties['marker-symbol'] = 'circle';
        return pt;
    }
    return point(getCoord(pivot), {'marker-symbol': 'circle'});
}
