import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import flatten from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename: filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});
// fixtures = fixtures.filter(({name}) => (name === 'FeatureCollection'));

test('flatten', t => {
    fixtures.forEach(fixture => {
        const filename = fixture.filename;
        const name = fixture.name;
        const geojson = fixture.geojson;

        const flattened = flatten(geojson);

        if (process.env.REGEN) write.sync(directories.out + filename, flattened);
        t.deepEqual(flattened, load.sync(directories.out + filename), name);
        t.equal(flattened.type, 'FeatureCollection', name + ': feature outputs a featurecollection');

        switch (geojson.geometry ? geojson.geometry.type : geojson.type) {
        case 'Point':
        case 'LineString':
        case 'Polygon':
            break;
        default:
            t.true(flattened.features.length > 1, name + ': featureCollection has multiple features with feature input');
        }
    });
    t.end();
});
