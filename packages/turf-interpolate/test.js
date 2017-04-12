const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const featureCollection = require('@turf/helpers').featureCollection;
const interpolate = require('./');

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

test('turf-interpolate', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const {cellSize} = geojson.properties;
        const grid = truncate(interpolate(geojson, cellSize));
        // const results = featureCollection([geojson, grid]);
        const g = JSON.stringify(grid);

        // featureEach(points, function (point) {
            // set color
            // "marker-color": "#F00" #0000ff -> #00ffff
        // });

    if (process.env.REGEN) write.sync(directories.out + filename, grid);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
