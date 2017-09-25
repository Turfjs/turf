const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const point = require('@turf/helpers').point;
const featureCollection = require('@turf/helpers').featureCollection;
const featureEach = require('@turf/meta').featureEach;
const concave = require('./');

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

test('turf-concave', t => {
    fixtures.forEach(fixture => {
        const filename = fixture.filename;
        const name = fixture.name;
        const geojson = fixture.geojson;
        const properties = geojson.properties || {};
        const maxEdge = properties.maxEdge || 1;
        const units = properties.units;

        const hull = concave(geojson, maxEdge, units);
        featureEach(geojson, stylePt);
        const results = featureCollection([...geojson.features, hull]);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    });
    t.end();
});


const points = featureCollection([point([0, 0]), point([1, 1]), point([1, 0])]);
const onePoint = featureCollection([point([0, 0])]);

test('concave -- throw', t => {
    t.throws(() => concave(onePoint, 5.5, 'miles'), /too few polygons found to compute concave hull/, 'too few points');
    t.throws(() => concave(onePoint, 0), /too few polygons found to compute concave hull/, 'maxEdge too small');

    t.throws(() => concave(null, 0), /points is required/, 'no points');
    t.throws(() => concave(points, null), /maxEdge is required/, 'no maxEdge');
    t.throws(() => concave(points, 1, 'foo'), /units is invalid/, 'invalid units');

    t.end();
});

function stylePt(pt) {
    pt.properties['marker-color'] = '#f0f';
    pt.properties['marker-size'] = 'small';
}
