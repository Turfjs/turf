const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const flatten = require('.');

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
    for (const {filename, name, geojson} of fixtures) {
        const flattened = flatten(geojson);

        if (process.env.REGEN) {
            write.sync(directories.out + filename, flattened);
        }
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
    }
    t.end();
});
