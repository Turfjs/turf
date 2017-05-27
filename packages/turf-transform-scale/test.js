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
        let {factor, fromCenter, mutate} = geojson.properties || {};

        const scaled = scale(geojson, factor, fromCenter, mutate);
        const result = featureCollection([colorize(truncate(scaled, 6, 3)), geojson]);

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    }

    t.end();
});

test('scale -- throws', t => {
    const pt = point([-70.823364, -33.553984]);

    t.throws(() => scale(null, 1.5), 'missing geojson');
    t.throws(() => scale(pt, null), 'missing factor');

    t.end();
});

test('scale -- mutated input', t => {
    const line = lineString([[10, 10], [12, 15]]);
    const lineBefore = JSON.parse(JSON.stringify(line));

    scale(line, 1.5);
    t.deepEqual(line, lineBefore, 'input should not be mutated');
    t.end();
});

test('scale -- geometry support', t => {
    const line = lineString([[10, 10], [12, 15]]);
    t.assert(scale(geometryCollection([line.geometry]), 1.5), 'geometryCollection support');
    t.assert(scale(geometryCollection([line.geometry]).geometry, 1.5), 'geometryCollection support');
    t.assert(scale(featureCollection([line]), 1.50), 'featureCollection support');
    t.assert(scale(line.geometry, 1.5), 'geometry line support');
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
