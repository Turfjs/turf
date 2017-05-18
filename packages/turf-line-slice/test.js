const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const {featureCollection} = require('@turf/helpers');
const lineSlice = require('./');

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

test('turf-line-slice', t => {
    for (const {filename, geojson, name} of fixtures) {
        const [linestring, start, stop] = geojson.features;
        const sliced = truncate(lineSlice(start, stop, linestring));
        sliced.properties['stroke'] = '#f0f';
        sliced.properties['stroke-width'] = 6;
        const results = featureCollection(geojson.features);
        results.features.push(sliced);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
