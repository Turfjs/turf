const test = require('tape');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('../truncate').default;
const { featureEach, coordEach } = require('../meta');
const { lineString, featureCollection } = require('../helpers');
const center = require('../center').default;
const centerMean = require('./').default;

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

var fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('turf-center-mean', t => {
    fixtures.forEach(fixture => {
        const filename = fixture.filename;
        const name = fixture.name;
        const geojson = fixture.geojson;
        const options = geojson.options || {};
        options.properties = {'marker-symbol': 'star', 'marker-color': '#F00'};
        const centered = truncate(centerMean(geojson, options));

        // Display Results
        const results = featureCollection([]);
        featureEach(geojson, feature => results.features.push(feature));
        coordEach(geojson, coord => results.features.push(lineString([coord, centered.geometry.coordinates], {stroke: '#00F', 'stroke-width': 1})));
        // Add @turf/center to compare position
        results.features.push(truncate(center(geojson, {properties: {'marker-symbol': 'circle', 'marker-color': '#00F'}})));
        results.features.push(centered);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    });
    t.end();
});

test('turf-center-mean -- properties', t => {
    const line = lineString([[0, 0], [1, 1]]);
    const pt = centerMean(line, {properties: {foo: 'bar'}});
    t.equal(pt.properties.foo, 'bar', 'translate properties');
    t.end();
});
