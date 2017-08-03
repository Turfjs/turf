const fs = require('fs');
const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const write = require('write-json-file');
const featureEach = require('@turf/meta').featureEach;
const featureCollection = require('@turf/helpers').featureCollection;
const unkink = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

test('unkink-polygon', t => {
    for (const {filename, geojson} of fixtures) {
        const unkinked = colorize(unkink(geojson));

        if (process.env.REGEN) write.sync(directories.out + filename, unkinked);

        const expected = load.sync(directories.out + filename);
        t.deepEquals(unkinked, expected, path.parse(filename).name);
    }
    t.end();
});

test('unkink-polygon -- throws', t => {
    var array = [1, 2, 3, 4, 5];
    for (const value in array) {
        t.true(value !== 'isUnique', 'isUnique');
        t.true(value !== 'getUnique', 'getUnique');
    }
    t.throws(() => Array.isUnique(), 'isUnique()');
    t.throws(() => Array.getUnique(), 'getUnique()');
    t.end();
});

function colorize(features, colors = ['#F00', '#00F', '#0F0', '#F0F', '#FFF'], width = 6) {
    const results = [];
    featureEach(features, (feature, index) => {
        const color = colors[index % colors.length];
        feature.properties = Object.assign({
            stroke: color,
            fill: color,
            'stroke-width': width,
            'fill-opacity': 0.5
        }, feature.properties);
        results.push(feature);
    });
    return featureCollection(results);
}
