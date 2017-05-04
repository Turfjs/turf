const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const polygonTangents = require('./');

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

test('turf-polygon-tangents', t => {
    for (const {name, filename, geojson} of fixtures) {
        const results = polygonTangents(geojson.features[1], geojson.features[0]);
        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(load.sync(directories.out + filename), results, name);
    }
    t.end();
});


