const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const {point, lineString, geometryCollection, featureCollection} = require('@turf/helpers');
const translate = require('./');

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

test('translate', t => {
    for (const {filename, name, geojson} of fixtures) {
        let {distance, direction, units, zTranslation} = geojson.properties || {};

        const translated = translate(geojson, distance, direction, units, zTranslation);
        const result = featureCollection([colorize(truncate(translated, 6, 3)), geojson]);

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    }

    t.end();
});

test('translate -- throws', t => {
    const pt = point([-70.823364, -33.553984]);

    t.throws(() => translate(null, 100, -29), 'missing geojson');
    t.throws(() => translate(pt, null, 98), 'missing distance');
    t.throws(() => translate(pt, 23, null), 'missing direction');
    t.throws(() => translate(pt, 56, 57, 'notAunit'), 'invalid units');
    t.throws(() => translate(pt, 56, 57, 'miles', 'zTrans'), 'invalid zTranslation');

    t.end();
});

test('rotate -- mutated input', t => {
    const line = lineString([[10, 10], [12, 15]]);
    const lineBefore = JSON.parse(JSON.stringify(line));

    translate(line, 100, 50);
    t.deepEqual(line, lineBefore, 'input should NOT be mutated');

    translate(line, 100, 50, 'kilometers', undefined, true);
    t.deepEqual(truncate(line, 1), lineString([[10.7, 10.6], [12.7, 15.6]]), 'input should be mutated');
    t.end();
});

test('rotate -- geometry support', t => {
    const line = lineString([[10, 10], [12, 15]]);
    t.assert(translate(geometryCollection([line.geometry]), 100, 50), 'geometryCollection support');
    t.assert(translate(geometryCollection([line.geometry]).geometry, 100, 50), 'geometryCollection support');
    t.assert(translate(featureCollection([line]), 100, 50), 'featureCollection support');
    t.assert(translate(line.geometry, 100, 50), 'geometry line support');
    t.assert(translate(line.geometry, 100, 50), 'geometry pt support');
    t.assert(translate(line, 0, 100), 'shortcut no-motion');
    t.skip('pt coordinate support');
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
