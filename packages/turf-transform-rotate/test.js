const test = require('tape');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const write = require('write-json-file');
const centroid = require('@turf/centroid');
const helpers = require('@turf/helpers');
const featureCollection = helpers.featureCollection;
const point = helpers.point;
const lineString = helpers.lineString;
const rotate = require('./');

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

test('rotate', t => {
    for (const {filename, name, geojson}  of fixtures) {
        let {angle, pivot} = geojson.properties || {};

        const rotated = rotate(geojson, angle, pivot);

        // style result
        if (rotated.geometry.type === 'Point' || rotated.geometry.type === 'MultiPoint') {
            rotated.properties['marker-color'] = '#F00';
            rotated.properties['marker-symbol'] = 'star';
        } else {
            rotated.properties["stroke"] = "#F00";
            rotated.properties["stroke-width"] = 4;
        }
        if (pivot) {
            if (Array.isArray(pivot)) {
                pivot = point(pivot);
            }
        } else {
            pivot = centroid(geojson);
        }
        pivot.properties['marker-symbol'] = 'circle';

        const result = featureCollection([rotated, geojson, pivot]);

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    }

    t.end();
});

test('rotate -- throws', t => {
    const line = lineString([[10, 10], [12, 15]]);

    t.throws(() => rotate(null, 100), 'missing geojson');
    t.throws(() => rotate(line, null), 'missing angle');
    t.throws(() => rotate(line, 56, 'notApoint'), 'invalid pivot');

    t.end();
});
