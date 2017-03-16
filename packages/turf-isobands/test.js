const test = require('tape');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const write = require('write-json-file');
const isobands = require('./');

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

test('isobands', t => {
    fixtures.forEach(({name, geojson, filename}) => {
        const results = isobands(geojson, 'elevation', [0, 3, 5, 7, 10]);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.equal(results.features[0].geometry.type, 'MultiPolygon', name + ' geometry=MultiPolygon');
        t.deepEqual(results, load.sync(directories.out + filename), name);
    });
    t.end();
});
