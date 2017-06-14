const glob = require('glob');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const {point} = require('@turf/helpers');
const isClockwise = require('./');

test('isClockwise#fixtures', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature] = geojson.features;
        t.true(isClockwise(feature), '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '*.geojson')).forEach(filepath => {
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const [feature] = geojson.features;
        t.false(isClockwise(feature), '[false] ' + name);
    });
    t.end();
});

test('isClockwise -- throws', t => {
    const pt = point([-10, -33]);
    t.throws(() => isClockwise(pt), 'feature geometry not supported');

    t.end();
});
