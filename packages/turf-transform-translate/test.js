const test = require('tape');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const write = require('write-json-file');
const helpers = require('@turf/helpers');
const featureCollection = helpers.featureCollection;
const point = helpers.point;
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
    for (const {filename, name, geojson}  of fixtures) {
        let {distance, direction, units, zTranslation} = geojson.properties || {};

        const translated = translate(geojson, distance, direction, units, zTranslation);

        // style result
        if (translated.geometry.type === 'Point' || translated.geometry.type === 'MultiPoint') {
            translated.properties['marker-color'] = '#F00';
            translated.properties['marker-symbol'] = 'star';
        } else {
            translated.properties["stroke"] = "#F00";
            translated.properties["stroke-width"] = 4;
        }

        const result = featureCollection([translated, geojson]);

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
