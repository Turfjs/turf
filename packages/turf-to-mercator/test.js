const fs = require('fs');
const test = require('tape');
const path = require('path');
const proj4 = require('proj4');
const load = require('load-json-file');
const write = require('write-json-file');
const toMercator = require('./');
var meta = require('@turf/meta');
var coordEach = meta.coordEach;
var clone = require('@turf/clone');

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

test('turf-to-mercator', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const {mutate} = geojson.properties || {};
        const results = toMercator(geojson, mutate);

        // var compare = clone(geojson);
        // coordEach(compare, function (coord) {
        //     var newCoord = proj4('EPSG:900913', coord);
        //     coord[0] = newCoord[0];
        //     coord[1] = newCoord[1];
        // });

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
