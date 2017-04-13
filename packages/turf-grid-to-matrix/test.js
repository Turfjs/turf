const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const gridToMatrix = require('./');

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

test('grid-to-matrix', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const matrix = gridToMatrix(geojson);

        if (process.env.REGEN) write.sync(directories.out + filename, matrix);
        t.deepEquals(matrix, load.sync(directories.out + filename), name);
    }
    t.end();
});

