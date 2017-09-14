const glob = require('glob');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const {lineString, polygon} = require('@turf/helpers');
const parallel = require('./');

test('turf-boolean-parallel', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [line1, line2] = geojson.features;
        const result = parallel(line1, line2);

        if (process.env.SHAPELY) shapely.contains(line1, line2).then(result => t.true(result, '[true] shapely - ' + name));
        t.true(result, '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [line1, line2] = geojson.features;
        const result = parallel(line1, line2);

        if (process.env.SHAPELY) shapely.contains(line1, line2).then(result => t.false(result, '[false] shapely - ' + name));
        t.false(result, '[false] ' + name);
    });
    t.end();
});


test('turf-boolean-parallel -- throws', t => {
    const line = lineString([[0, 0], [0, 1]]);
    const poly = polygon([[[0, 0], [0, 1], [1, 1], [0, 0]]]);

    t.throws(() => parallel(null, line), /line1 is required/, 'missing line1');
    t.throws(() => parallel(line, null), /line2 is required/, 'missing line2');
    t.throws(() => parallel(poly, line), /line1 must be a LineString/, 'different types');
    t.throws(() => parallel(line, poly), /line2 must be a LineString/, 'different types');
    t.throws(() => parallel({}, line), /Invalid GeoJSON type for line1/, 'invalid types');
    t.throws(() => parallel(line, {}), /Invalid GeoJSON type for line2/, 'invalid types');

    t.end();
});
