const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const featureCollection = require('@turf/helpers').featureCollection;
const truncate = require('@turf/truncate');
const lineSlice = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(folder => {
    return {
        folder,
        linestring: load.sync(path.join(directories.in, folder, 'linestring.geojson')),
        start: load.sync(path.join(directories.in, folder, 'start.geojson')),
        stop: load.sync(path.join(directories.in, folder, 'stop.geojson'))
    };
});

test('turf-line-slice', t => {
    for (const {folder, linestring, start, stop} of fixtures) {
        const output = path.join(directories.out, folder) + path.sep;

        const sliced = truncate(lineSlice(start, stop, linestring));
        sliced.properties['stroke'] = '#f0f';
        sliced.properties['stroke-width'] = 6;

        const results = featureCollection([linestring, start, stop, sliced]);
        if (process.env.REGEN) {
            mkdirp.sync(output);
            write.sync(output + 'sliced.geojson', sliced);
            write.sync(output + 'results.geojson', results);
        }
        const expected = load.sync(output + 'sliced.geojson');

        t.deepEquals(sliced, expected, folder);
    }
    t.end();
});
