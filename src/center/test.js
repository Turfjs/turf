const fs = require('fs');
const test = require('tape');
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const bboxPolygon = require('../bbox-polygon').default;
const bbox = require('../bbox').default;
const { featureEach, coordEach } = require('../meta');
const { lineString, featureCollection } = require('../helpers');
const center = require('./').default;

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

test('turf-center', t => {
    fixtures.forEach(fixture => {
        const filename = fixture.filename;
        const name = fixture.name;
        const geojson = fixture.geojson;

        const options = geojson.options || {};
        options.properties = {'marker-symbol': 'star', 'marker-color': '#F00'};
        const centered = center(geojson, options);

        // Display Results
        const results = featureCollection([centered])
        featureEach(geojson, feature => results.features.push(feature))
        const extent = bboxPolygon(bbox(geojson))
        extent.properties = {stroke: '#00F', 'stroke-width': 1, 'fill-opacity': 0}
        coordEach(extent, coord => results.features.push(lineString([coord, centered.geometry.coordinates], {stroke: '#00F', 'stroke-width': 1})))
        results.features.push(extent)
        
        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    });
    t.end();
});

test('turf-center -- properties', t => {
    const line = lineString([[0, 0], [1, 1]]);
    const pt = center(line, {properties: {foo: 'bar'}});
    t.equal(pt.properties.foo, 'bar', 'translate properties');
    t.end();
});
