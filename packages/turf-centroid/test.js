import path from 'path';
import test from 'tape';
import glob from 'glob';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureEach } from '@turf/meta';
import { featureCollection, lineString } from '@turf/helpers';
import centroid from '.';

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

test('centroid', t => {
    fixtures.forEach(fixture => {
        const name = fixture.name;
        const geojson = fixture.geojson;
        const out = fixture.out;
        const centered = centroid(geojson, {'marker-symbol': 'circle'});
        const result = featureCollection([centered]);
        featureEach(geojson, feature => result.features.push(feature));

        if (process.env.REGEN) write.sync(out, result);
        t.deepEqual(result, load.sync(out), name);
    });
    t.end();
});

test('centroid -- properties', t => {
    const line = lineString([[0, 0], [1, 1]]);
    const pt = centroid(line, {foo: 'bar'});
    t.equal(pt.properties.foo, 'bar', 'translate properties');
    t.end();
});
