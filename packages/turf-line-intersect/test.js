const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const {featureEach} = require('@turf/meta');
const {featureCollection, lineString} = require('@turf/helpers');
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
        const points = truncate(lineIntersect(line1, line2));
        const results = featureCollection([line1, line2]);
        featureEach(points, point => results.features.push(point));

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

test('turf-line-intersect - same point #688', t => {
    const line1 = lineString([[7, 50], [8, 50], [9, 50]]);
    const line2 = lineString([[8, 49], [8, 50], [8, 51]]);

    var results = lineIntersect(line1, line2);
    t.equal(results.features.length, 1, 'should return single point');
    t.end();
});
