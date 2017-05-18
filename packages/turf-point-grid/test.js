const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const {featureEach} = require('@turf/meta');
const grid = require('./');

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
// fixtures = fixtures.filter(({name}) => name === 'resolute');

test('turf-point-grid', t => {
    for (const {name, geojson} of fixtures) {
        const grid5 = grid(geojson, 5, 'miles');
        const grid20 = grid(geojson, 20, 'miles');
        const gridCentered = grid(geojson, 12.5, 'miles', true);

        // Add current GeoJSON to grid results
        featureEach(geojson, feature => {
            feature.properties = {
                stroke: '#F00',
                'stroke-width': 6,
                'fill-opacity': 0
            };
            grid5.features.push(feature);
            grid20.features.push(feature);
            gridCentered.features.push(feature);
        });

        if (process.env.REGEN) {
            mkdirp.sync(directories.out + name);
            write.sync(path.join(directories.out, name, '5-miles.geojson'), grid5);
            write.sync(path.join(directories.out, name, '20-miles.geojson'), grid20);
            write.sync(path.join(directories.out, name, 'centered.geojson'), gridCentered);
        }
        t.deepEqual(grid5, load.sync(path.join(directories.out, name, '5-miles.geojson')), name + ' -- 5 miles');
        t.deepEqual(grid20, load.sync(path.join(directories.out, name, '20-miles.geojson')), name + ' -- 20 miles');
        t.deepEqual(gridCentered, load.sync(path.join(directories.out, name, 'centered.geojson')), name + ' -- centered');
    }
    t.end();
});
