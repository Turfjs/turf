const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const featureEach = require('@turf/meta').featureEach;
const featureCollection = require('@turf/helpers').featureCollection;
const buffer = require('./');

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

test('turf-buffer', function (t) {
    for (const {filename, name, geojson} of fixtures) {
        let {radius, units, padding} = geojson.properties || {};
        radius = radius || 50;
        units = units || 'miles';

        const buffered = truncate(buffer(geojson, radius, units, padding));

        // Add Results to FeatureCollection
        const results = featureCollection([]);
        featureEach(buffered, feature => results.features.push(feature));
        featureEach(geojson, feature => results.features.push(feature));

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
