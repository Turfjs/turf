const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const proj4 = require('proj4');
const write = require('write-json-file');
const clone = require('@turf/clone');
const {point} = require('@turf/helpers');
const truncate = require('@turf/truncate');
const {coordEach} = require('@turf/meta');
const {toMercator, toWgs84} = require('./');

const directories = {
    mercator: path.join(__dirname, 'test', 'mercator') + path.sep,
    wgs84: path.join(__dirname, 'test', 'wgs84') + path.sep
};


const fromWgs84 = fs.readdirSync(directories.wgs84).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.wgs84 + filename)
    };
});

test('to-mercator', t => {
    for (const {filename, name, geojson}  of fromWgs84) {
        var compare = clone(geojson);
        coordEach(compare, function (coord) {
            var newCoord = proj4('WGS84', 'EPSG:900913', coord);
            coord[0] = newCoord[0];
            coord[1] = newCoord[1];
        });
        const result = toMercator(geojson);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(truncate(result, 7), truncate(compare, 7), name);
    }
    t.end();
});



const fromMercator = fs.readdirSync(directories.mercator).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.mercator + filename)
    };
});

test('to-wgs84', t => {
    for (const {filename, name, geojson}  of fromMercator) {
        var compare = clone(geojson);
        coordEach(compare, function (coord) {
            var newCoord = proj4('EPSG:900913', 'WGS84', coord);
            coord[0] = newCoord[0];
            coord[1] = newCoord[1];
        });
        const result = toWgs84(geojson);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(truncate(result, 7), truncate(compare, 7), name);
    }
    t.end();
});



test('projection -- throws', t => {
    t.throws(() => toMercator(null), /geojson is required/, 'throws missing geojson');
    t.throws(() => toWgs84(null), /geojson is required/, 'throws missing geojson');
    t.end();
});



test('projection -- verify mutation', t => {
    const pt1 = point([10, 10]);
    const pt2 = point([15, 15]);
    const pt1Before = clone(pt1);
    const pt2Before = clone(pt2);

    toMercator(pt1);
    toMercator(pt1, false);
    t.deepEqual(pt1, pt1Before, 'mutate = undefined - input should NOT be mutated');
    t.deepEqual(pt1, pt1Before, 'mutate = false - input should NOT be mutated');
    toMercator(pt1, true);
    t.notEqual(pt1, pt1Before, 'input should be mutated');

    toWgs84(pt2);
    toWgs84(pt2, false);
    t.deepEqual(pt2, pt2Before, 'mutate = undefined - input should NOT be mutated');
    t.deepEqual(pt2, pt2Before, 'mutate = false - input should NOT be mutated');
    toWgs84(pt2, true);
    t.notEqual(pt2, pt2Before, 'input should be mutated');

    t.end();
});
