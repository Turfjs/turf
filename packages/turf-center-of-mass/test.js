import path from 'path';
import test from 'tape';
import glob from 'glob';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureEach } from '@turf/meta';
import {
    point,
    lineString,
    polygon,
    featureCollection,
 } from '@turf/helpers';
import centerOfMass from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep,
};

const fixtures = glob.sync(directories.in + '*.geojson').map(input => {
    const base = path.parse(input).base;
    return {
        name: path.parse(input).name,
        filename: base,
        geojson: load.sync(input),
        out: directories.out + base,
    };
});

test('center of mass', t => {
    fixtures.forEach(fixture => {
        const name = fixture.name;
        const out = fixture.out;
        const geojson = fixture.geojson;
        const centered = centerOfMass(geojson, {'marker-symbol': 'circle'});
        const result = featureCollection([centered]);
        featureEach(geojson, feature => result.features.push(feature));

        if (process.env.REGEN) write.sync(out, result);
        t.deepEqual(result, load.sync(out), name);
    });
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
