const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const turfBBox = require('@turf/bbox');
const featureEach = require('@turf/meta').featureEach;
const squareGrid = require('./');


const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    const geojson = load.sync(directories.in + filename);
    return {
        filename,
        geojson,
        name: path.parse(filename).name,
        bbox: turfBBox(geojson)
    };
});

test('square-grid', t => {
    for (const {name, bbox, geojson} of fixtures) {
        const grid5 = squareGrid(bbox, 5, 'miles');
        const grid20 = squareGrid(bbox, 20, 'miles');

        // Add current GeoJSON to grid results
        featureEach(geojson, feature => {
            feature.properties = {
                stroke: '#F00',
                'stroke-width': 6,
                'fill-opacity': 0
            };
            grid5.features.push(feature);
            grid20.features.push(feature);
        });

        if (process.env.REGEN) {
            write.sync(directories.out + name + '-5-miles.geojson', grid5);
            write.sync(directories.out + name + '-20-miles.geojson', grid20);
        }
        t.deepEqual(grid5, load.sync(directories.out + name + '-5-miles.geojson'), name + ' -- 5-miles');
        t.deepEqual(grid20, load.sync(directories.out + name + '-20-miles.geojson'), name + ' -- 20-miles');
    }
    t.end();
});
