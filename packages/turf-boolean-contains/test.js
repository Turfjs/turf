const glob = require('glob');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const contains = require('./');

test('turf-boolean-contains#fixtures', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        t.true(contains(feature1, feature2), '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        t.false(contains(feature1, feature2), '[false] ' + name);
    });
    t.end();
});
