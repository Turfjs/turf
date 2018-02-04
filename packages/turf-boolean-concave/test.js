const glob = require('glob');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const { polygon, point } = require('@turf/helpers');
const concave = require('./').default;

test('concave#fixtures', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '*.geojson')).forEach(filepath => {
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const feature = geojson.features[0];
        t.true(concave(feature), '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '*.geojson')).forEach(filepath => {
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const feature = geojson.features[0];
        t.false(concave(feature), '[false] ' + name);
    });
    t.end();
});

test('concave -- Geometry types', t => {
    const poly = polygon([[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]);

    t.equal(concave(poly), false, 'Feature');
    t.equal(concave(poly.geometry), false, 'Geometry Object');

    t.end();
});

test('concave -- throws', t => {
    const pt = point([-10, -33]);
    t.throws(() => concave(pt), 'feature geometry not supported');

    t.end();
});
