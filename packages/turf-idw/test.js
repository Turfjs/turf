const fs = require('fs');
const path = require('path');
const test = require('tape');
const write = require('write-json-file');
const load = require('load-json-file');
const idw = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('idw', t => {
    const testPoints = load.sync(directories.in + 'data.geojson');

    const idw1 = idw(testPoints, 'value', 0.5, 1, 'kilometers');
    const idw2 = idw(testPoints, 'value', 0.5, 0.5, 'kilometers');
    const idw3 = idw(testPoints, 'value', 2, 1, 'miles');
    const idw4 = idw(testPoints, 'WRONGDataField', 0.5, 1, 'miles');

    t.ok(idw1.features.length);
    t.ok(idw2.features.length);
    t.ok(idw3.features.length);
    t.error(idw4);

    if (process.env.REGEN) {
        write.sync(directories.out + 'idw1.geojson', idw1);
        write.sync(directories.out + 'idw2.geojson', idw2);
        write.sync(directories.out + 'idw3.geojson', idw3);
    }

    t.end();
});
