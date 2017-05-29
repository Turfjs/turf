const path = require('path');
const test = require('tape');
const glob = require('glob');
const load = require('load-json-file');
const write = require('write-json-file');
const {featureEach} = require('@turf/meta');
const {point, lineString, polygon, featureCollection} = require('@turf/helpers');
const centerOfMass = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep,
}

const fixtures = glob.sync(directories.in + '*.geojson').map(input => {
    const {name, base} = path.parse(input);
    return {
        name,
        filename: base,
        geojson: load.sync(input),
        out: directories.out + base,
    }
});

test('center of mass', t => {
    for (const {name, out, geojson} of fixtures) {
        const centered = centerOfMass(geojson, {'marker-symbol': 'circle'});
        const result = featureCollection([centered]);
        featureEach(geojson, feature => result.features.push(feature));

        if (process.env.REGEN) write.sync(out, result);
        t.deepEqual(result, load.sync(out), name);
    };
    t.end();
});

test('center of mass -- Geometry Support', t => {
    const line = lineString([[0, 0], [1, 1]]);
    const poly = polygon([[[0, 0], [3, 3], [-5, -5], [0, 0]]]);

    t.deepEqual(centerOfMass(poly.geometry), centerOfMass(poly), 'polygon geometry/feature should be equal');
    t.deepEqual(centerOfMass(line.geometry), centerOfMass(line), 'lineString geometry/feature should be equal');
    t.end();
});

test('center of mass -- no area', t => {
    const poly = polygon([[[0, 0], [0, 0], [0, 0], [0, 0]]]);
    const pt = centerOfMass(poly);
    t.deepEqual(pt, point([0, 0]), 'polygon has no area');
    t.end();
});

test('center of mass -- properties', t => {
    const line = lineString([[0, 0], [1, 1]]);
    const pt = centerOfMass(line, {foo: 'bar'});
    t.equal(pt.properties.foo, 'bar', 'translate properties');
    t.end();
});
