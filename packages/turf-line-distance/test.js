const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const lineDistance = require('./');

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

test('turf-line-distance', t => {
    for (const {name, geojson} of fixtures) {
        const results = Math.round(lineDistance(geojson, 'feet'));
        if (process.env.REGEN) write.sync(directories.out + name + '.json', results);
        t.equal(results, load.sync(directories.out + name + '.json'), name);
    }
    t.end();
});
