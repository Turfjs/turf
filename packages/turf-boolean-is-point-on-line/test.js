const glob = require('glob');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const pointOnLine = require('./');

test('turf-boolean-point-on-line', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        const result = pointOnLine(feature1, feature2, feature1.properties.ignoreEndPoint);

        t.true(result, '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '**', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        const result = pointOnLine(feature1, feature2, feature1.properties.ignoreEndPoint);

        t.false(result, '[false] ' + name);
    });
    t.end();
});
