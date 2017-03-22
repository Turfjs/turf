const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const featureCollection = require('@turf/helpers').featureCollection;
const featureEach = require('@turf/meta').featureEach;
const polygonSlice = require('.');

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
        const sliced = polygonSlice(polygon, linestring);

        // Color Results
        polygon.properties['stroke'] = '#f00';
        polygon.properties['stroke-width'] = 6;
        polygon.properties['fill-opacity'] = 0;
        linestring.properties['stroke'] = '#f0f';
        linestring.properties['stroke-width'] = 6;
        const results = featureCollection([polygon, linestring]);
        featureEach(sliced, feature => results.features.push(feature));

        // Save Tests
        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
