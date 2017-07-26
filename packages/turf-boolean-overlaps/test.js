const glob = require('glob');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const {point, lineString} = require('@turf/helpers');
const overlaps = require('./');

test('turf-boolean-overlaps', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        const result = overlaps(feature1, feature2);

        if (process.env.SHAPELY) shapely.contains(feature1, feature2).then(result => t.true(result, '[true] shapely - ' + name));
        t.true(result, '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        const result = overlaps(feature1, feature2);

        if (process.env.SHAPELY) shapely.contains(feature1, feature2).then(result => t.false(result, '[false] shapely - ' + name));
        t.false(result, '[false] ' + name);
    });
    t.end();
});

test('turf-boolean-overlaps -- throws', t => {
    const pt = point([9, 50]);
    const line = lineString([[7, 50], [8, 50], [9, 50]]);

    t.throws(() => overlaps(null, line), /feature1 is required/, 'missing feature1');
    t.throws(() => overlaps(line, null), /feature2 is required/, 'missing feature2');
    t.throws(() => overlaps(pt, line), /features must be of the same type/, 'different types');
    t.throws(() => overlaps(pt, pt), /Point geometry not supported/, 'geometry not supported');

    t.end();
});
