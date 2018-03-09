const fs = require('fs');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const write = require('write-json-file');
const combine = require('@turf/combine');
const union = require('./');

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

test('union', function (t) {
    for (const {name, geojson, filename} of fixtures) {
        let result = null;
        if (geojson.features.length > 2) {
            var last = geojson.features.pop();
            var multipoly = combine(geojson);
            result = union(last, multipoly.features[0]);
        } else {
            result = union(geojson.features[0], geojson.features[1]);
        }
        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    }
    t.end();
});
