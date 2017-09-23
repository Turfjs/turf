const test = require('tape');
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');
const shapely = require('boolean-shapely');
const {polygon, lineString} = require('@turf/helpers');
const crosses = require('./');

test('turf-boolean-crosses', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        if (process.env.SHAPELY) shapely.crosses(feature1, feature2).then(result => t.true(result, '[true] shapely - ' + name));
        t.true(crosses(feature1, feature2), '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        if (process.env.SHAPELY) shapely.crosses(feature1, feature2).then(result => t.false(result, '[false] shapely - ' + name));
        t.false(crosses(feature1, feature2), '[false] ' + name);
    });
    t.end();
});

test('turf-boolean-crosses -- custom', t => {
    const poly = polygon([[[-1, 2], [3, 2], [3, 3], [-1, 3], [-1, 2]]]);
    const line = lineString([[0, 2.5], [-4, 2]]);

    t.true(crosses(poly, line));
    if (process.env.SHAPELY) t.true(shapely.crosses(poly, line));
    t.end();
});
