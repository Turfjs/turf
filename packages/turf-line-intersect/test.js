const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const {featureCollection, geometryCollection, lineString} = require('@turf/helpers');
const lineIntersect = require('./');

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

test('turf-line-intersect', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const [line1, line2] = geojson.features;
        const results = truncate(lineIntersect(line1, line2));
        results.features.push(line1);
        results.features.push(line2);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

test('turf-line-intersect - prevent input mutation', t => {
    const line1 = lineString([[7, 50], [8, 50], [9, 50]]);
    const line2 = lineString([[8, 49], [8, 50], [8, 51]]);
    const before1 = JSON.parse(JSON.stringify(line1));
    const before2 = JSON.parse(JSON.stringify(line2));

    lineIntersect(line1, line2);
    t.deepEqual(line1, before1, 'line1 input should not be mutated');
    t.deepEqual(line2, before2, 'line2 input should not be mutated');
    t.end();
});

test('turf-line-intersect - Geometry Objects', t => {
    const line1 = lineString([[7, 50], [8, 50], [9, 50]]);
    const line2 = lineString([[8, 49], [8, 50], [8, 51]]);
    t.ok(lineIntersect(line1.geometry, line2.geometry).features.length, 'support Geometry Objects');
    t.ok(lineIntersect(featureCollection([line1]), featureCollection([line2])).features.length, 'support Feature Collection');
    t.ok(lineIntersect(geometryCollection([line1.geometry]), geometryCollection([line2.geometry])).features.length, 'support Geometry Collection');
    t.end();
});

test('turf-line-intersect - same point #688', t => {
    const line1 = lineString([[7, 50], [8, 50], [9, 50]]);
    const line2 = lineString([[8, 49], [8, 50], [8, 51]]);

    const results = lineIntersect(line1, line2);
    t.equal(results.features.length, 1, 'should return single point');
    t.end();
});
