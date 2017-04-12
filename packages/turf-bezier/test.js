const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const featureCollection = require('@turf/helpers').featureCollection;
const bezier = require('./');

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

test('turf-bezier', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const spline = colorize(bezier(geojson));
        const results = featureCollection([spline, geojson]);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

function colorize(feature, color = '#F00', width = 6) {
    feature.properties = {
        stroke: color,
        fill: color,
        'stroke-width': width,
        'fill-opacity': 0.1
    };
    return feature;
}
