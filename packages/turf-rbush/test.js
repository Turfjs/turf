const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const rbush = require('./');

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

test('turf-rbush', t => {
    for (const {name, filename, geojson} of fixtures) {
        const tree = rbush(geojson);
        const all = tree.all();
        const search = tree.search(geojson.features[0]);

        if (process.env.REGEN) {
            write.sync(directories.out + 'all.' + filename, all);
            write.sync(directories.out + 'search.' + filename, search);
        }

        t.deepEqual(all, load.sync(directories.out + 'all.' + filename), 'all.' + name);
        t.deepEqual(search, load.sync(directories.out + 'search.' + filename), 'search.' + name);
    }
    t.end();
});
