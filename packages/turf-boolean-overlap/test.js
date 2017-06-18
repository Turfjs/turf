const path = require('path');
const test = require('tape');
const glob = require('glob');
const load = require('load-json-file');
const overlap = require('./');

const directories = {
    true: path.join(__dirname, 'test', 'true', '*.geojson'),
    false: path.join(__dirname, 'test', 'false', '*.geojson')
};

const fixtures = [];

glob.sync(directories.true).forEach(filepath => {
    fixtures.push({
        name: path.parse(filepath).name,
        geojson: load.sync(filepath),
        matchType: true
    });
});

glob.sync(directories.false).forEach(filepath => {
    fixtures.push({
        name: path.parse(filepath).name,
        geojson: load.sync(filepath),
        matchType: false
    });
});

test('turf-boolean-overlap', t => {
    for (let {name, geojson, matchType} of fixtures) {
        const [feature1, feature2] = geojson.features;
        if (name === 'polygonsShareBoundary') {
            t.skip(name);
            continue;
        }
        t.deepEquals(overlap(feature1, feature2), matchType, `${name} returns as ${matchType}`);
    }
    t.end();
});
