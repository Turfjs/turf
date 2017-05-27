const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const {point, lineString, geometryCollection, featureCollection} = require('@turf/helpers');
const scale = require('./');

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
        let {factor, fromCorner, mutate} = geojson.properties || {};

        const scaled = scale(geojson, factor, fromCorner, mutate);
        const result = featureCollection([colorize(truncate(scaled, 6, 3)), geojson]);

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    }

    t.end();
});

test('scale -- throws', t => {
    const line = lineString([[10, 10], [12, 15]]);

    t.throws(() => scale(null, 1.5), /geojson is required/);
    t.throws(() => scale(line, null), /invalid factor/);
    t.throws(() => scale(line, 0), /invalid factor/);
    t.throws(() => scale(line, 1.5, 'foobar'), /fromCorner is invalid/);

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
    t.deepEqual(line, lineBefore, 'input should NOT be mutated');

    scale(line, 1.5, 'centroid', true);
    t.deepEqual(truncate(line, 1), lineString([[8.5, 6.2], [13.5, 18.7]]), 'input should be mutated');
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
