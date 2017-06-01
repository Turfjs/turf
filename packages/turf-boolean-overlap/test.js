var test = require('tape');
var path = require('path');
var fs = require('fs');
var load = require('load-json-file');
var overlap = require('./');

var directories = {
    true: path.join(__dirname, 'test', 'true') + path.sep,
    false: path.join(__dirname, 'test', 'false') + path.sep
};

var trueFixtures = fs.readdirSync(directories.true).map(filename => {
    return {
        filename,
        geojson: load.sync(directories.true + filename),
        matchType: true
    };
});

var falseFixtures = fs.readdirSync(directories.false).map(filename => {
    return {
        filename,
        geojson: load.sync(directories.false + filename),
        matchType: false
    };
});

test('turf-boolean-overlap', t => {
    for (let {filename, geojson, matchType} of trueFixtures) {
        t.deepEquals(overlap(geojson.features[0], geojson.features[1]), matchType, path.parse(filename).name + ' returns as ' + matchType);
    }
    for (let {filename, geojson, matchType} of falseFixtures) {
        t.deepEquals(overlap(geojson.features[0], geojson.features[1]), matchType, path.parse(filename).name + ' returns as ' + matchType);
    }
    t.end();
});