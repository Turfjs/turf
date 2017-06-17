const test = require('tape');
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');
const crosses = require('./');

test('turf-boolean-crosses#fixtures', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        t.true(crosses(feature1, feature2), '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature1, feature2] = geojson.features;
        t.false(crosses(feature1, feature2), '[false] ' + name);
    });
    t.end();
});
