const fs = require('fs');
const path = require('path');
const test = require('tape');
const write = require('write-json-file');
const load = require('load-json-file');
const {point, featureCollection} = require('@turf/helpers');
const idw = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename: filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('idw', t => {
    for (const {name, geojson, filename} of fixtures) {
        const {valueField, weight, cellWidth, units} = geojson.properties || {};
        const result = idw(geojson, valueField, weight, cellWidth, units);

        if (process.env.REGEN) write.sync(directories.out + filename, result);

        t.ok(result.features.length, name);
    }
    t.end();
});

test('idw -- errors', t => {
    const points = featureCollection([
        point([0, 0], {foo: 2}),
        point([1, 1], {unknown: 3}),
        point([0, -3], {bar: 5})
    ]);
    t.throws(() => idw(points), /valueField is required/);
    t.throws(() => idw(points, 'value'), /weight is required/);
    t.throws(() => idw(points, 'value', 1), /cellWidth is required/);
    t.throws(() => idw(points, 'WRONGDataField', 0.5, 1, 'miles'), /Specified Data Field is Missing/);
    t.end();
});
