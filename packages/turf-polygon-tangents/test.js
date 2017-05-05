const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const {polygon, point} = require('@turf/helpers');
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
        const [poly, pt] = geojson.features;
        const results = polygonTangents(pt, poly);
        results.features = results.features.concat(geojson.features);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(load.sync(directories.out + filename), results, name);
    }
    t.end();
});

test('turf-polygon-tangents - Geometry Objects', t => {
    const pt = point([61, 5]);
    const poly = polygon([[[11, 0], [22, 4], [31, 0], [31, 11], [21, 15], [11, 11], [11, 0]]]);
    t.assert(polygonTangents(pt.geometry, poly.geometry));
    t.end();
});

test('turf-polygon-tangents - Prevent Input Mutation', t => {
    const pt = point([61, 5]);
    const poly = polygon([[[11, 0], [22, 4], [31, 0], [31, 11], [21, 15], [11, 11], [11, 0]]]);
    const beforePoly = JSON.parse(JSON.stringify(poly));
    const beforePt = JSON.parse(JSON.stringify(pt));
    polygonTangents(pt.geometry, poly.geometry);
    t.deepEqual(poly, beforePoly, 'pt should not mutate');
    t.deepEqual(pt, beforePt, 'poly should not mutate');
    t.end();
});