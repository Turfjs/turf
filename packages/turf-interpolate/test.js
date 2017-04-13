const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const featureEach = require('@turf/meta').featureEach;
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

    // const coloredGeojson = setColor(geojson);
    //     const gjs = JSON.stringify(coloredGeojson);

        const grid = truncate(interpolate(geojson, cellSize));
        // const results = featureCollection([geojson, grid]);
        const coloredGrid = setColor(grid);
        const g = JSON.stringify(coloredGrid);


        if (process.env.REGEN) write.sync(directories.out + filename, grid);
            t.deepEquals(grid, load.sync(directories.out + filename), name);
    }
    t.end();
});


function setColor(grid) {
    featureEach(grid, function (pt) {
        // set color #0000ff -> #00ffff
        const elev = Math.round(pt.properties.elevation);
        const shade = elev.toString(16);
        const color = '#' + shade + shade + shade;
        pt.properties['marker-color'] = color;
    });
    return grid;
}