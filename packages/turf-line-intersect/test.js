const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const featureEach = require('@turf/meta').featureEach;
const featureCollection = require('@turf/helpers').featureCollection;
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
        const line1 = geojson.features[0];
        const line2 = geojson.features[1];
        const points = lineIntersect(line1, line2);
        const results = featureCollection([line1, line2]);
        featureEach(points, point => results.features.push(point));

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
