const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const {point, lineString, geometryCollection, featureCollection} = require('@turf/helpers');
const simplify = require('./');

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

test('simplify', t => {
    for (const {filename, name, geojson} of fixtures) {
        let {tolerance, highQuality} = geojson.properties || {};
        tolerance = tolerance || 0.01;
        highQuality = highQuality || false;

        const simplified = simplify(geojson, tolerance, highQuality);
        // const result = featureCollection([simplified, geojson]);

        if (process.env.REGEN) write.sync(directories.out + filename, simplified);
        t.deepEqual(simplified, load.sync(directories.out + filename), name);
    }

    t.end();
});
