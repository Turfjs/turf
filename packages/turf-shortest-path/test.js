const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const {featureCollection} = require('@turf/helpers');
const shortestPath = require('./');

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

test('turf-shortest-path', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const {start, end, obstacles, options} = geojson;
        const path = shortestPath(start, end, obstacles, options);
        path.properties['stroke'] = '#F00';
        path.properties['stroke-width'] = 5;

        const results = featureCollection([start, end, obstacles, path]);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

