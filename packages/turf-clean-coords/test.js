const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const {multiPoint, lineString, multiPolygon} = require('@turf/helpers');
const write = require('write-json-file');
const cleanCoords = require('./');

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

test('turf-clean-coords', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const results = cleanCoords(geojson);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

test('turf-clean-coords -- extras', t => {
    t.equal(cleanCoords(multiPoint([[0, 0], [0, 0], [2, 2]])).geometry.coordinates.length, 2);
    t.end();
});

test('turf-clean-coords -- throws', t => {
    t.throws(() => cleanCoords(null), /geojson is required/, 'missing geojson');
    t.end();
});

test('turf-clean-coords -- prevent input mutation', t => {
    const line = lineString([[0, 0], [1, 1], [2, 2]], {foo: 'bar'});
    cleanCoords(line);
    const lineBefore = JSON.parse(JSON.stringify(line));
    t.deepEqual(lineBefore, line, 'line should NOT be mutated');

    const multiPoly = multiPolygon([
        [[[0, 0], [1, 1], [2, 2], [2, 0], [0, 0]]],
        [[[0, 0], [0, 5], [5, 5], [5, 5], [5, 0], [0, 0]]]
    ], {hello: 'world'});
    const multiPolyBefore = JSON.parse(JSON.stringify(multiPoly));
    cleanCoords(multiPoly);
    t.deepEqual(multiPolyBefore, multiPoly, 'multiPolygon should NOT be mutated');

    const cleanLine = cleanCoords(line, true);
    t.deepEqual(cleanLine, line, 'line should be mutated');
    t.end();
});
