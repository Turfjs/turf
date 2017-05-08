const path = require('path');
const test = require('tape');
const glob = require('glob');
const load = require('load-json-file');
const write = require('write-json-file');
const getCoords = require('@turf/invariant').getCoords;
const {featureCollection, lineString} = require('@turf/helpers');
const destination = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('turf-destination', t => {
    for (const filepath of glob.sync(directories.in + '*.geojson')) {
        const geojson = load.sync(filepath);
        const {name, base} = path.parse(filepath);

        // Params
        let {bearing, dist} = geojson.properties || {};
        bearing = (bearing !== undefined) ? bearing : 180;
        dist = (dist !== undefined) ? dist : 100;

        const dest = destination(geojson, dist, bearing);
        const result = featureCollection([geojson, dest, lineString([getCoords(geojson), getCoords(dest)])]);

        if (process.env.REGEN) write.sync(directories.out + base, result);
        t.deepEqual(result, load.sync(directories.out + base), name);
    }
    t.end();
});
