const path = require('path');
const test = require('tape');
const glob = require('glob');
const load = require('load-json-file');
const write = require('write-json-file');
const {featureEach} = require('@turf/meta');
const {point, lineString, polygon, featureCollection} = require('@turf/helpers');
const centroid = require('./');

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

test('centroid', t => {
      for (const {name, geojson, out}  of fixtures) {
        const centered = centroid(geojson, {'marker-symbol': 'circle'});
        const result = featureCollection([centered]);
        featureEach(geojson, feature => result.features.push(feature));

        if (process.env.REGEN) write.sync(out, result);
        t.deepEqual(result, load.sync(out), name);
    }
    t.end();
});

test('centroid -- properties', t => {
    const line = lineString([[0, 0], [1, 1]]);
    const pt = centroid(line, {foo: 'bar'});
    t.equal(pt.properties.foo, 'bar', 'translate properties');
    t.end();
});
