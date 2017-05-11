const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const {featureEach, flattenEach} = require('@turf/meta');
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

const featureAndCollection = geojson => {

    const geometry = geojson.geometry;

    const geometryCollection = {
        type: 'GeometryCollection',
        geometries: [geometry]
    };

    const feature = {
        type: 'Feature',
        geometry: geometry
    };

    const featureCollection = {
        type: 'FeatureCollection',
        features: [feature]
    };

    return [geometry, geometryCollection, feature, featureCollection];
};

test('turf-line-intersect', t => {
    for (const {filename, name, geojson}  of fixtures) {

        const [feature1, feature2] = geojson.features;

        featureAndCollection(feature1).forEach((line1) => {

            featureAndCollection(feature2).forEach((line2) => {

                const points = truncate(lineIntersect(line1, line2));

                let results = [];
                featureEach(points, point => results.push(point));
                results = featureCollection(results);

                if (process.env.REGEN) write.sync(directories.out + filename, results);
                const testName = name + '#' + line1.type + '-' + line2.type;
                t.deepEquals(results, load.sync(directories.out + filename), testName);

            });

        });
    }
    t.end();
});

test('turf-line-intersect - same point #688', t => {
    const line1 = lineString([[7, 50], [8, 50], [9, 50]]);
    const line2 = lineString([[8, 49], [8, 50], [8, 51]]);

    const results = lineIntersect(line1, line2);
    t.equal(results.features.length, 1, 'should return single point');
    t.end();
});
