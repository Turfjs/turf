const test = require('tape');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const write = require('write-json-file');
const helpers = require('@turf/helpers');
const featureCollection = helpers.featureCollection;
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
        if (translated.geometry.type === 'Point') {
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

// test('translate -- throws', t => {
//     const points = pointGrid([-70.823364, -33.553984, -70.473175, -33.302986], 5);
//
//     t.throws(() => isobands(random('polygon'), [1, 2, 3]), 'invalid points');
//     t.throws(() => isobands(points, ''), 'invalid breaks');
//     t.throws(() => isobands(points, [1, 2, 3], 'temp', { isobandProperties: 'hello' }), 'invalid options');
//
//     t.end();
// });
