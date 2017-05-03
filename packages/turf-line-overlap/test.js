const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const {featureEach} = require('@turf/meta');
const {featureCollection, lineString} = require('@turf/helpers');
const lineOverlap = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('turf-line-overlap', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const source = colorize(geojson.features[0], '#00F').features[0];
        const target = colorize(geojson.features[1], '#00F').features[0];
        const shared = colorize(lineOverlap(source, target), '#F00');

        const results = featureCollection([target, source].concat(shared.features));

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

test('turf-line-overlap - Geometry Object', t => {
    const line1 = lineString([[115, -35], [125, -30], [135, -30], [145, -35]]);
    const line2 = lineString([[135, -30], [145, -35]]);

    t.true(lineOverlap(line1.geometry, line2.geoemtry).features.length > 0);
    t.end();
});

function colorize(features, color = '#F00', width = 6) {
    const results = [];
    featureEach(features, feature => {
        feature.properties = {
            stroke: color,
            fill: color,
            'stroke-width': width,
            'fill-opacity': 0.1
        };
        results.push(feature);
    });
    return featureCollection(results);
}
