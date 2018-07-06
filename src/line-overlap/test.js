const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const { featureEach } = require('../meta');
const { featureCollection, lineString } = require('../helpers');
const lineOverlap = require('./').default;

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});
// fixtures = fixtures.filter(({name}) => name.includes('#901'));

test('turf-line-overlap', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const [source, target] = geojson.features;
        const shared = colorize(lineOverlap(source, target, geojson.properties), '#0F0');
        const results = featureCollection(shared.features.concat([source, target]));

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

test('turf-line-overlap - Geometry Object', t => {
    const line1 = lineString([[115, -35], [125, -30], [135, -30], [145, -35]]);
    const line2 = lineString([[135, -30], [145, -35]]);

    t.true(lineOverlap(line1.geometry, line2.geometry).features.length > 0, 'support geometry object');
    t.end();
});

function colorize(features, color = '#F00', width = 25) {
    const results = [];
    featureEach(features, feature => {
        feature.properties = {
            stroke: color,
            fill: color,
            'stroke-width': width
        };
        results.push(feature);
    });
    if (features.type === 'Feature') return results[0];
    return featureCollection(results);
}
