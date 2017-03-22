const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const featureCollection = require('@turf/helpers').featureCollection;
const featureEach = require('@turf/meta').featureEach;
const polygonSlice = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    const geojson = load.sync(directories.in + filename);
    const polygon = geojson.features[0];
    const linestring = geojson.features[1];
    return {
        name: path.parse(filename).name,
        filename,
        geojson,
        polygon,
        linestring
    };
});

// fixtures = fixtures.filter(({name}) => name === 'exact-coordinates');

test('turf-slice', t => {
    for (const {name, filename, polygon, linestring} of fixtures) {
        const results = colorSegments(polygonSlice(polygon, linestring));

        // Save Tests
        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

// Preview LineStrings with different colors
function colorSegments(segments) {
    const results = featureCollection([]);
    featureEach(segments, (feature, index) => {
        const r = (index % 2 === 0) ? 'F' : '0';
        const g = (index % 2 === 0) ? '0' : '0';
        const b = (index % 2 === 0) ? '0' : 'F';
        feature.properties = Object.assign({
            stroke: '#' + r + g + b,
            'stroke-width': 6
        }, feature.properties);
        results.features.push(feature);
    });
    return results;
}
