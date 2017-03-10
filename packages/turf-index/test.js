const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const index = require('./');

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

test('turf-index', t => {
    for (const {name, geojson} of fixtures) {
        const tree = index(geojson);
        var result = tree.all();

        if (process.env.REGEN) write.sync(directories.out + name + '.json', result);
        t.deepEqual(result, load.sync(directories.out + name + '.json'), name);
    }
    t.end();
});
