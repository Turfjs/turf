const test = require('tape');
const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const write = require('write-json-file');
const lineString = require('@turf/helpers').lineString;
const featureCollection = require('@turf/helpers').featureCollection;
const featureEach = require('@turf/meta').featureEach;
const center = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep,
};

const fixtures = glob.sync(directories.in + '*.geojson').map(input => {
    const name = path.parse(input).name;
    const base = path.parse(input).base;
    return {
        name,
        filename: base,
        geojson: load.sync(input),
        out: directories.out + base,
    };
});

test('center', t => {
    fixtures.forEach(fixture => {
        const name = fixture.name;
        const geojson = fixture.geojson;
        const out = fixture.out;
        const centered = center(geojson, {'marker-symbol': 'circle'});
        const result = featureCollection([centered]);
        featureEach(geojson, feature => result.features.push(feature));

        if (process.env.REGEN) write.sync(out, result);
        t.deepEqual(result, load.sync(out), name);
    });
    t.end();
});

test('center -- properties', t => {
    const line = lineString([[0, 0], [1, 1]]);
    const pt = center(line, {foo: 'bar'});
    t.equal(pt.properties.foo, 'bar', 'translate properties');
    t.end();
});
